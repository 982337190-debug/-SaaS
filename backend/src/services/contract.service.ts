import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import {
  Contract,
  ContractPaymentType,
  ContractStatus,
  ContractType,
} from '../entities/contract.entity';
import { ContractAudit, ContractAuditStatus } from '../entities/contract-audit.entity';
import { ContractAiIssue } from '../entities/contract-ai-issue.entity';
import { ContractAiTask, ContractAiTaskStatus } from '../entities/contract-ai-task.entity';
import { ContractFile } from '../entities/contract-file.entity';
import { ContractOperationLog } from '../entities/contract-operation-log.entity';
import { ContractReminder, ContractReminderStatus } from '../entities/contract-reminder.entity';
import { ContractTemplate, ContractTemplateStatus } from '../entities/contract-template.entity';
import { ContractVersion } from '../entities/contract-version.entity';
import {
  ContractAuditActionDto,
  CreateContractFileDto,
  CreateContractDto,
  CreateContractTemplateDto,
  CreateContractVersionDto,
  StartContractAiAuditDto,
  UpdateContractDto,
} from '../dto/contract.dto';

type ContractAiAnalysisIssue = {
  risk_type: string;
  risk_level: string;
  risk_description: string;
  original_text: string;
  suggestion: string;
};

type ContractAiAnalysis = {
  score: number;
  level: string;
  result: string;
  summary: string;
  issues: ContractAiAnalysisIssue[];
  extracted_fields: Record<string, any>;
  raw_outputs?: Record<string, any>;
};

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(ContractFile)
    private contractFileRepository: Repository<ContractFile>,
    @InjectRepository(ContractAiTask)
    private contractAiTaskRepository: Repository<ContractAiTask>,
    @InjectRepository(ContractAiIssue)
    private contractAiIssueRepository: Repository<ContractAiIssue>,
    @InjectRepository(ContractAudit)
    private contractAuditRepository: Repository<ContractAudit>,
    @InjectRepository(ContractVersion)
    private contractVersionRepository: Repository<ContractVersion>,
    @InjectRepository(ContractOperationLog)
    private contractOperationLogRepository: Repository<ContractOperationLog>,
    @InjectRepository(ContractTemplate)
    private contractTemplateRepository: Repository<ContractTemplate>,
    @InjectRepository(ContractReminder)
    private contractReminderRepository: Repository<ContractReminder>,
  ) {}

  generateContractNo() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `HT${year}${month}${day}${random}`;
  }

  generateAiTaskId() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `AI${year}${month}${day}${random}`;
  }

  async create(createDto: CreateContractDto) {
    this.validateBusinessFields(createDto);
    const contract = this.contractRepository.create({
      ...createDto,
      contract_no: this.generateContractNo(),
      current_version: 'V1.0',
      status: ContractStatus.DRAFT,
      currency: createDto.currency || 'CNY',
    });
    await this.contractRepository.save(contract);
    await this.contractVersionRepository.save(this.contractVersionRepository.create({
      contract_id: contract.id,
      version_no: contract.current_version,
      change_reason: '首次创建',
      creator_name: contract.owner_name || '系统用户',
    }));
    await this.syncReminders(contract);
    await this.logOperation(contract.id, 'CREATE', `创建合同草稿 ${contract.contract_no}`, contract.owner_name);
    return this.findOne(contract.id);
  }

  async findAll(
    page = 1,
    pageSize = 20,
    search?: string,
    status?: string,
    contractType?: string,
    supplierId?: string,
  ) {
    const query = this.contractRepository.createQueryBuilder('contract');

    if (search) {
      query.where(
        'contract.contract_no LIKE :search OR contract.contract_name LIKE :search OR contract.supplier_name LIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('contract.status = :status', { status });
    }

    if (contractType) {
      query.andWhere('contract.contract_type = :contractType', { contractType });
    }

    if (supplierId) {
      query.andWhere('contract.supplier_id = :supplierId', { supplierId });
    }

    const [list, total] = await query
      .orderBy('contract.created_at', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { data: list, total, page, pageSize };
  }

  async findOne(id: string) {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: {
        files: true,
        audits: true,
        versions: true,
        reminders: true,
        ai_tasks: true,
        ai_issues: true,
        operation_logs: true,
      },
    });
    if (!contract) {
      throw new BadRequestException('合同不存在');
    }
    return this.buildContractDetail(contract);
  }

  async update(id: string, updateDto: UpdateContractDto) {
    const contract = await this.getContractRecord(id);
    this.ensureEditable(contract);
    const merged = { ...contract, ...updateDto };
    this.validateBusinessFields(merged);
    Object.assign(contract, updateDto);
    await this.contractRepository.save(contract);
    await this.syncReminders(contract);
    await this.logOperation(contract.id, 'UPDATE', `更新合同信息 ${contract.contract_no}`, contract.owner_name);
    return this.findOne(contract.id);
  }

  async remove(id: string) {
    const contract = await this.getContractRecord(id);
    if (contract.status !== ContractStatus.DRAFT) {
      throw new BadRequestException('只有草稿状态的合同才能删除');
    }
    await this.logOperation(contract.id, 'DELETE', `删除合同 ${contract.contract_no}`, contract.owner_name);
    await this.contractRepository.delete(id);
    return { message: '合同已删除' };
  }

  async submit(id: string) {
    const contract = await this.getContractRecord(id);
    if (contract.status !== ContractStatus.DRAFT && contract.status !== ContractStatus.REJECTED) {
      throw new BadRequestException('当前状态不允许提交审核');
    }
    await this.contractRepository.update(id, { status: ContractStatus.SUBMITTED });
    await this.logOperation(contract.id, 'SUBMIT', `提交合同审核 ${contract.contract_no}`, contract.owner_name);
    return this.findOne(id);
  }

  async getAuditList(status?: string, supplierId?: string) {
    const query = this.contractRepository.createQueryBuilder('contract')
      .where('contract.status IN (:...statuses)', {
        statuses: [
          ContractStatus.SUBMITTED,
          ContractStatus.AUDITING,
          ContractStatus.PENDING_MANUAL_REVIEW,
          ContractStatus.REJECTED,
        ],
      });

    if (status) {
      query.andWhere('contract.status = :status', { status });
    }

    if (supplierId) {
      query.andWhere('contract.supplier_id = :supplierId', { supplierId });
    }

    const list = await query.orderBy('contract.updated_at', 'DESC').getMany();
    return { data: list };
  }

  async startAiAudit(id: string, dto: StartContractAiAuditDto) {
    const contract = await this.getContractRecord(id);
    if (![ContractStatus.SUBMITTED, ContractStatus.REJECTED, ContractStatus.PENDING_MANUAL_REVIEW].includes(contract.status)) {
      throw new BadRequestException('当前状态不允许发起AI审核');
    }

    const task = this.contractAiTaskRepository.create({
      contract_id: contract.id,
      task_id: this.generateAiTaskId(),
      file_id: dto.file_id,
      status: ContractAiTaskStatus.PROCESSING,
      progress_message: '正在提交到 Dify Workflow',
    });
    await this.contractAiTaskRepository.save(task);

    try {
      const workflowResponse = await this.runDifyWorkflow(contract, dto.file_id);
      task.workflow_run_id = workflowResponse.workflow_run_id || workflowResponse.data?.id;
      task.provider_task_id = workflowResponse.task_id;
      task.raw_response = workflowResponse;
      task.progress_message = 'Dify Workflow 已受理，正在分析合同条款';
      await this.contractAiTaskRepository.save(task);

      await this.contractRepository.update(contract.id, {
        status: ContractStatus.AUDITING,
        ai_last_task_id: task.task_id,
      });
      await this.logOperation(contract.id, 'AI_AUDIT_START', `发起 Dify AI审核任务 ${task.task_id}`, contract.owner_name);

      const workflowStatus = this.getDifyWorkflowStatus(workflowResponse);
      if (workflowStatus === 'succeeded') {
        await this.finishAiAuditTask(task, workflowResponse);
      } else if (workflowStatus === 'failed' || workflowStatus === 'stopped') {
        task.status = ContractAiTaskStatus.FAILED;
        task.error_message = this.getDifyWorkflowError(workflowResponse) || 'Dify Workflow 执行失败';
        await this.contractAiTaskRepository.save(task);
        throw new BadRequestException(task.error_message);
      }

      return {
        contract_id: contract.id,
        task_id: task.task_id,
        status: this.mapAiTaskStatus(task.status),
      };
    } catch (error) {
      task.status = ContractAiTaskStatus.FAILED;
      task.error_message = error instanceof Error ? error.message : 'Dify Workflow 调用失败';
      await this.contractAiTaskRepository.save(task);
      throw error;
    }
  }

  async getAiTask(taskId: string) {
    let task = await this.contractAiTaskRepository.findOne({
      where: { task_id: taskId },
      relations: { contract: true },
    });
    if (!task) {
      throw new BadRequestException('AI审核任务不存在');
    }

    if (task.status === ContractAiTaskStatus.PROCESSING && task.workflow_run_id) {
      const workflowResponse = await this.getDifyWorkflowRun(task.workflow_run_id);
      task.raw_response = workflowResponse;
      task.progress_message = this.getDifyWorkflowProgressMessage(workflowResponse);

      const workflowStatus = this.getDifyWorkflowStatus(workflowResponse);
      if (workflowStatus === 'succeeded') {
        task = await this.finishAiAuditTask(task, workflowResponse);
      } else if (workflowStatus === 'failed' || workflowStatus === 'stopped') {
        task.status = ContractAiTaskStatus.FAILED;
        task.error_message = this.getDifyWorkflowError(workflowResponse) || 'Dify Workflow 执行失败';
        await this.contractAiTaskRepository.save(task);
      } else {
        await this.contractAiTaskRepository.save(task);
      }
    }

    return {
      task_id: task.task_id,
      status: this.mapAiTaskStatus(task.status),
      progress_message: task.progress_message,
      error_message: task.error_message,
      contract_id: task.contract_id,
    };
  }

  async auditPass(id: string, dto: ContractAuditActionDto) {
    const contract = await this.getContractRecord(id);
    if (![ContractStatus.SUBMITTED, ContractStatus.AUDITING, ContractStatus.PENDING_MANUAL_REVIEW].includes(contract.status)) {
      throw new BadRequestException('当前合同不在审核流程中');
    }
    await this.contractRepository.update(id, { status: ContractStatus.APPROVED });
    await this.contractAuditRepository.save(this.contractAuditRepository.create({
      contract_id: contract.id,
      audit_status: ContractAuditStatus.PASS,
      audit_comment: dto.comment,
      audit_user_name: '审核人员',
    }));
    await this.logOperation(contract.id, 'MANUAL_AUDIT_PASS', `人工审核通过：${dto.comment}`, '审核人员');
    return this.findOne(id);
  }

  async auditReject(id: string, dto: ContractAuditActionDto) {
    const contract = await this.getContractRecord(id);
    if (![ContractStatus.SUBMITTED, ContractStatus.AUDITING, ContractStatus.PENDING_MANUAL_REVIEW].includes(contract.status)) {
      throw new BadRequestException('当前合同不在审核流程中');
    }
    await this.contractRepository.update(id, { status: ContractStatus.REJECTED });
    await this.contractAuditRepository.save(this.contractAuditRepository.create({
      contract_id: contract.id,
      audit_status: ContractAuditStatus.REJECT,
      audit_comment: dto.comment,
      audit_user_name: '审核人员',
    }));
    await this.logOperation(contract.id, 'MANUAL_AUDIT_REJECT', `人工审核驳回：${dto.comment}`, '审核人员');
    return this.findOne(id);
  }

  async createVersion(id: string, dto: CreateContractVersionDto) {
    const contract = await this.getContractRecord(id);
    const versionNo = dto.version_no || this.getNextVersion(contract.current_version);
    const version = this.contractVersionRepository.create({
      contract_id: id,
      version_no: versionNo,
      change_reason: dto.change_reason,
      file_id: dto.file_id,
      creator_name: '系统用户',
    });
    await this.contractVersionRepository.save(version);
    if (dto.file_id) {
      await this.contractFileRepository.save(this.contractFileRepository.create({
        contract_id: id,
        version_no: versionNo,
        file_name: dto.file_id,
        file_type: this.detectFileType(dto.file_id),
        file_url: dto.file_id,
        upload_user: '系统用户',
      }));
    }
    await this.contractRepository.update(id, { current_version: versionNo });
    await this.logOperation(contract.id, 'CREATE_VERSION', `创建合同版本 ${versionNo}`, '系统用户');
    return version;
  }

  async addFile(id: string, dto: CreateContractFileDto) {
    const contract = await this.getContractRecord(id);
    const fileRecord = this.contractFileRepository.create({
      contract_id: id,
      version_no: dto.version_no || contract.current_version || 'V1.0',
      file_name: dto.file_name,
      file_type: this.detectFileType(dto.file_name || dto.file_url),
      file_url: dto.file_url,
      file_size: dto.file_size,
      upload_user: dto.upload_user || contract.owner_name || '系统用户',
    });
    await this.contractFileRepository.save(fileRecord);
    await this.logOperation(contract.id, 'UPLOAD_FILE', `上传合同文件 ${dto.file_name}`, dto.upload_user || contract.owner_name || '系统用户');
    return fileRecord;
  }

  async getVersions(id: string) {
    await this.findOne(id);
    const data = await this.contractVersionRepository.find({
      where: { contract_id: id },
      order: { created_at: 'DESC' },
    });
    return { data };
  }

  async getTemplates() {
    const data = await this.contractTemplateRepository.find({
      order: { updated_at: 'DESC' },
    });
    return { data };
  }

  async createTemplate(dto: CreateContractTemplateDto) {
    const template = this.contractTemplateRepository.create({
      ...dto,
      version: dto.version || 'V1.0',
      status: ContractTemplateStatus.ACTIVE,
    });
    await this.contractTemplateRepository.save(template);
    return template;
  }

  async enableTemplate(id: string) {
    const template = await this.contractTemplateRepository.findOne({ where: { id } });
    if (!template) {
      throw new BadRequestException('模板不存在');
    }
    template.status = ContractTemplateStatus.ACTIVE;
    await this.contractTemplateRepository.save(template);
    return template;
  }

  async disableTemplate(id: string) {
    const template = await this.contractTemplateRepository.findOne({ where: { id } });
    if (!template) {
      throw new BadRequestException('模板不存在');
    }
    template.status = ContractTemplateStatus.DISABLED;
    await this.contractTemplateRepository.save(template);
    return template;
  }

  async getReminders() {
    const data = await this.contractReminderRepository.find({
      relations: { contract: true },
      order: { reminder_date: 'ASC' },
    });
    return {
      data: data.map((item) => ({
        id: item.id,
        contract_id: item.contract_id,
        contract_name: item.contract?.contract_name,
        supplier_name: item.contract?.supplier_name,
        end_date: item.contract?.end_date,
        reminder_days: item.reminder_days,
        reminder_date: item.reminder_date,
        remain_days: this.getRemainDays(item.contract?.end_date),
        owner_name: item.contract?.owner_name,
        status: item.status,
      })),
    };
  }

  async getStatistics() {
    const contracts = await this.contractRepository.find();
    const total = contracts.length;
    const audit = contracts.filter((item) =>
      [ContractStatus.SUBMITTED, ContractStatus.AUDITING, ContractStatus.PENDING_MANUAL_REVIEW].includes(item.status),
    ).length;
    const active = contracts.filter((item) => [ContractStatus.APPROVED, ContractStatus.SIGNED, ContractStatus.ACTIVE].includes(item.status)).length;
    const expireSoon = contracts.filter((item) => {
      const remain = this.getRemainDays(item.end_date);
      return remain !== null && remain <= 30 && remain >= 0;
    }).length;
    const amount = contracts.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    return { total, active, audit, expireSoon, amount };
  }

  private async syncReminders(contract: Contract) {
    await this.contractReminderRepository.delete({ contract_id: contract.id });
    if (!contract.end_date) {
      return;
    }

    const reminders = [90, 60, 30]
      .map((days) => this.createReminder(contract, days))
      .filter((item) => item !== null);

    if (reminders.length > 0) {
      await this.contractReminderRepository.save(reminders);
    }
  }

  private createReminder(contract: Contract, days: number) {
    if (!contract.end_date) {
      return null;
    }
    const end = new Date(contract.end_date);
    end.setDate(end.getDate() - days);
    return this.contractReminderRepository.create({
      contract_id: contract.id,
      reminder_days: days,
      reminder_date: end.toISOString().split('T')[0],
      status: ContractReminderStatus.OPEN,
    });
  }

  private getRemainDays(endDate?: string) {
    if (!endDate) {
      return null;
    }
    const target = new Date(endDate).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  }

  private getNextVersion(version: string) {
    const current = Number((version || 'V1.0').replace('V', '').split('.')[0]) || 1;
    return `V${current + 1}.0`;
  }

  private detectFileType(fileName?: string) {
    if (!fileName) {
      return 'UNKNOWN';
    }
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['doc', 'docx'].includes(ext || '')) return 'WORD';
    if (['xls', 'xlsx'].includes(ext || '')) return 'EXCEL';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'IMAGE';
    return (ext || 'UNKNOWN').toUpperCase();
  }

  private mapAiTaskStatus(status: ContractAiTaskStatus) {
    if (status === ContractAiTaskStatus.SUCCESS) return 'success';
    if (status === ContractAiTaskStatus.FAILED) return 'failed';
    return 'processing';
  }

  private getDifyConfig() {
    const configuredBaseUrl = (process.env.DIFY_BASE_URL || '').trim().replace(/\/$/, '');
    const apiKey = (process.env.DIFY_WORKFLOW_API_KEY || '').trim();
    const fileInputName = (process.env.DIFY_WORKFLOW_FILE_INPUT_NAME || 'contract_file').trim();
    const userPrefix = (process.env.DIFY_WORKFLOW_USER_PREFIX || 'contract-audit').trim();
    if (!configuredBaseUrl || !apiKey) {
      throw new BadRequestException('请先在 backend 环境变量中配置 DIFY_BASE_URL 和 DIFY_WORKFLOW_API_KEY');
    }
    const baseUrl = this.normalizeDifyBaseUrl(configuredBaseUrl);
    return { baseUrl, apiKey, fileInputName, userPrefix };
  }

  private normalizeDifyBaseUrl(value: string) {
    const trimmed = value.trim().replace(/\/$/, '');
    if (!trimmed) {
      return trimmed;
    }

    if (/\/workflow\/[^/]+$/i.test(trimmed)) {
      try {
        const url = new URL(trimmed);
        return `${url.origin}/v1`;
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

  private async runDifyWorkflow(contract: Contract, fileId?: string) {
    const { baseUrl, apiKey, fileInputName, userPrefix } = this.getDifyConfig();
    const latestFile = await this.getLatestContractFile(contract.id, fileId);
    const workflowParameters = await this.getDifyWorkflowParameters(baseUrl, apiKey);
    const user = `${userPrefix}:${contract.owner_id || contract.id}`;
    const payload = {
      inputs: await this.buildWorkflowInputs(contract, latestFile, fileInputName, baseUrl, apiKey, user, workflowParameters),
      response_mode: 'blocking',
      user,
    };
    return this.callDifyApi(`${baseUrl}/workflows/run`, apiKey, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  private async getDifyWorkflowRun(workflowRunId: string) {
    const { baseUrl, apiKey } = this.getDifyConfig();
    try {
      return await this.callDifyApi(`${baseUrl}/workflows/run/${workflowRunId}`, apiKey);
    } catch (error) {
      return this.callDifyApi(`${baseUrl}/workflows/${workflowRunId}`, apiKey);
    }
  }

  private async callDifyApi(url: string, apiKey: string, init?: RequestInit) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);
    try {
      const response = await fetch(url, {
        method: init?.method || 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          ...(init?.headers || {}),
        },
        body: init?.body,
        signal: controller.signal,
      });
      const text = await response.text();
      const json = text ? this.tryParseJson(text) : {};
      if (!response.ok) {
        const message = json?.message || json?.error || json?.detail || `Dify 请求失败(${response.status})`;
        throw new BadRequestException(message);
      }
      return json;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new BadRequestException('Dify Workflow 请求超时，请稍后重试');
      }
      throw new BadRequestException(error instanceof Error ? error.message : 'Dify Workflow 请求失败');
    } finally {
      clearTimeout(timeout);
    }
  }

  private async getDifyWorkflowParameters(baseUrl: string, apiKey: string) {
    return this.callDifyApi(`${baseUrl}/parameters`, apiKey);
  }

  private tryParseJson(text: string) {
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  }

  private async getLatestContractFile(contractId: string, fileId?: string) {
    if (fileId) {
      return this.contractFileRepository.findOne({ where: { contract_id: contractId, id: fileId } });
    }
    return this.contractFileRepository.findOne({
      where: { contract_id: contractId },
      order: { created_at: 'DESC' },
    });
  }

  private async buildWorkflowInputs(
    contract: Contract,
    latestFile: ContractFile | null | undefined,
    fileInputName: string,
    baseUrl: string,
    apiKey: string,
    user: string,
    workflowParameters?: any,
  ) {
    const baseInputs = this.buildDifyInputs(contract, latestFile, fileInputName);
    const declaredVariables = this.extractWorkflowVariables(workflowParameters);

    if (!declaredVariables.length) {
      return baseInputs;
    }

    const inputs: Record<string, any> = {};

    for (const variable of declaredVariables) {
      if (variable.type === 'file-list') {
        const fileInput = await this.buildDifyFileInput(latestFile, baseUrl, apiKey, user);
        if (!fileInput && variable.required) {
          throw new BadRequestException('当前 Dify Workflow 要求上传合同文件，请先为合同上传文件后再发起 AI 审核');
        }
        if (fileInput) {
          inputs[variable.name] = fileInput;
        }
        continue;
      }

      if (baseInputs[variable.name] != null && baseInputs[variable.name] !== '') {
        inputs[variable.name] = baseInputs[variable.name];
      } else if (variable.required) {
        throw new BadRequestException(`Dify Workflow 缺少必填输入：${variable.name}`);
      }
    }

    return inputs;
  }

  private extractWorkflowVariables(parameters?: any) {
    const formItems = Array.isArray(parameters?.user_input_form) ? parameters.user_input_form : [];
    return formItems.flatMap((item: Record<string, any>) =>
      Object.values(item || {}).map((field: any) => ({
        name: field?.variable,
        type: field?.type,
        required: Boolean(field?.required),
      })),
    ).filter((field: { name?: string }) => !!field.name);
  }

  private async buildDifyFileInput(
    latestFile: ContractFile | null | undefined,
    baseUrl: string,
    apiKey: string,
    user: string,
  ) {
    if (!latestFile?.file_url) {
      return null;
    }

    if (/^https?:\/\//i.test(latestFile.file_url)) {
      return [{
        type: 'document',
        transfer_method: 'remote_url',
        url: latestFile.file_url,
      }];
    }

    const localFilePath = this.resolveLocalContractFilePath(latestFile.file_url);
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      throw new BadRequestException('合同文件不存在，无法提交到 Dify Workflow');
    }

    const uploadFileId = await this.uploadFileToDify(baseUrl, apiKey, user, localFilePath, latestFile.file_name);
    return [{
      type: 'document',
      transfer_method: 'local_file',
      upload_file_id: uploadFileId,
    }];
  }

  private resolveLocalContractFilePath(fileUrl: string) {
    const normalized = fileUrl.trim();
    if (!normalized) {
      return '';
    }

    if (normalized.startsWith('/uploads/')) {
      return path.resolve(__dirname, '../../uploads', path.basename(normalized));
    }

    if (path.isAbsolute(normalized)) {
      return normalized;
    }

    const filename = path.basename(normalized);
    return path.resolve(__dirname, '../../uploads', filename);
  }

  private async uploadFileToDify(
    baseUrl: string,
    apiKey: string,
    user: string,
    localFilePath: string,
    originalName?: string,
  ) {
    const buffer = await fs.promises.readFile(localFilePath);
    const fileName = originalName || path.basename(localFilePath);
    const mimeType = this.getMimeType(fileName);
    const form = new FormData();
    form.append('user', user);
    form.append('file', new File([buffer], fileName, { type: mimeType }));

    const response = await fetch(`${baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: form,
    });

    const text = await response.text();
    const json = text ? this.tryParseJson(text) : {};
    if (!response.ok) {
      const message = json?.message || json?.error || json?.detail || `Dify 文件上传失败(${response.status})`;
      throw new BadRequestException(message);
    }

    const uploadFileId = json?.id || json?.data?.id;
    if (!uploadFileId) {
      throw new BadRequestException('Dify 文件上传成功，但未返回 upload_file_id');
    }
    return uploadFileId;
  }

  private getMimeType(filename: string) {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.xls': 'application/vnd.ms-excel',
      '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.csv': 'text/csv',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  private buildDifyInputs(contract: Contract, latestFile?: ContractFile | null, fileInputName = 'contract_file') {
    const resourceTypes = contract.resource_types || [];
    const validity = contract.start_date && contract.end_date
      ? `${contract.start_date} ~ ${contract.end_date}`
      : '';
    const inputs: Record<string, any> = {
      contract_id: contract.id,
      contract_no: contract.contract_no,
      contract_name: contract.contract_name,
      contract_type: contract.contract_type,
      source_type: contract.source_type,
      supplier_name: contract.supplier_name,
      resource_types: resourceTypes,
      resource_types_text: resourceTypes.join('、'),
      cooperation_area: contract.cooperation_area || '',
      cooperation_scope: contract.cooperation_scope || '',
      amount: contract.amount || contract.annual_estimated_amount || 0,
      currency: contract.currency || 'CNY',
      payment_type: contract.payment_type || '',
      advance_ratio: contract.advance_ratio || 0,
      payment_cycle_days: contract.payment_cycle_days || 0,
      refund_rule: contract.refund_rule || '',
      breach_liability: contract.breach_liability || '',
      contract_validity: validity,
      owner_name: contract.owner_name || '',
      contract_summary: [
        `合同编号：${contract.contract_no || ''}`,
        `合同名称：${contract.contract_name || ''}`,
        `供应商：${contract.supplier_name || ''}`,
        `合同类型：${contract.contract_type || ''}`,
        `资源类型：${resourceTypes.join('、')}`,
        `付款方式：${contract.payment_type || ''}`,
        `退款规则：${contract.refund_rule || '未填写'}`,
        `违约责任：${contract.breach_liability || '未填写'}`,
        `合作范围：${contract.cooperation_scope || '未填写'}`,
      ].join('\n'),
    };

    const fileUrl = latestFile?.file_url && /^https?:\/\//i.test(latestFile.file_url)
      ? latestFile.file_url
      : '';
    if (fileUrl) {
      inputs[fileInputName] = [{
        type: 'document',
        transfer_method: 'remote_url',
        url: fileUrl,
      }];
    }
    return inputs;
  }

  private getDifyWorkflowStatus(payload: any) {
    return payload?.data?.status || payload?.status || '';
  }

  private getDifyWorkflowOutputs(payload: any) {
    return payload?.data?.outputs || payload?.outputs || {};
  }

  private getDifyWorkflowError(payload: any) {
    return payload?.data?.error || payload?.error || payload?.message || '';
  }

  private getDifyWorkflowProgressMessage(payload: any) {
    const status = this.getDifyWorkflowStatus(payload);
    if (status === 'running') return 'Dify Workflow 正在分析合同';
    if (status === 'succeeded') return 'Dify Workflow 执行完成';
    if (status === 'failed') return this.getDifyWorkflowError(payload) || 'Dify Workflow 执行失败';
    return 'Dify Workflow 执行中';
  }

  private normalizeJsonLike<T>(value: unknown, fallback: T): T {
    if (value == null) {
      return fallback;
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return fallback;
      }
    }
    return value as T;
  }

  private parseRiskAuditReport(reportText: string) {
    const issues: ContractAiAnalysisIssue[] = [];
    const normalizedText = reportText.replace(/\r\n/g, '\n');
    const issueBlocks = normalizedText.match(/\d+\.\s+风险类型：[\s\S]*?(?=\n\d+\.\s+风险类型：|\n#\s+二、综合风险评估|$)/g) || [];

    for (const block of issueBlocks) {
      const riskType = block.match(/风险类型：([^\n]+)/)?.[1]?.trim() || '风险项';
      const riskLevel = block.match(/风险等级：([^\n]+)/)?.[1]?.trim() || '中风险';
      const riskDescription = block.match(/风险说明：([\s\S]*?)(?=\n\s*修改建议：|$)/)?.[1]?.trim() || '';
      const suggestion = block.match(/修改建议：([\s\S]*?)$/)?.[1]?.trim() || '';
      issues.push({
        risk_type: riskType,
        risk_level: riskLevel,
        risk_description: riskDescription,
        original_text: '',
        suggestion,
      });
    }

    const scoreText = normalizedText.match(/最终得分[：:]\s*(\d+(?:\.\d+)?)/)?.[1];
    const score = scoreText ? Number(scoreText) : 0;
    const level = normalizedText.match(/整体结论[：:]\s*([^\n]+)/)?.[1]?.trim() || '';
    const summary = normalizedText.match(/#\s*二、综合风险评估[\s\S]*$/)?.[0]?.trim() || normalizedText;
    const result = level.includes('高风险')
      ? '高风险'
      : level.includes('中风险')
        ? '需人工确认'
        : level.includes('低风险')
          ? '通过'
          : '';

    return {
      score,
      level,
      result,
      summary,
      issues,
      extracted_fields: {
        risk_audit_report: normalizedText,
      },
      raw_outputs: {
        risk_audit_report: normalizedText,
      },
    } satisfies ContractAiAnalysis;
  }

  private extractAiAnalysisFromDify(contract: Contract, payload: any): ContractAiAnalysis {
    const outputs = this.getDifyWorkflowOutputs(payload);
    const reportText = String(outputs.risk_audit_report || outputs.audit_report || outputs.report || '').trim();
    const normalizedIssues = this.normalizeJsonLike<Record<string, any>[]>(
      outputs.issues || outputs.risk_list || outputs.risk_items || outputs.issue_list,
      [],
    );
    const extractedFields = this.normalizeJsonLike<Record<string, any>>(
      outputs.extracted_fields || outputs.contract_info || outputs.extracted_contract_info,
      {},
    );

    const issues: ContractAiAnalysisIssue[] = Array.isArray(normalizedIssues)
      ? normalizedIssues.map((item) => ({
          risk_type: item.risk_type || item.type || item.category || '风险项',
          risk_level: item.risk_level || item.level || '中',
          risk_description: item.risk_description || item.description || item.content || '',
          original_text: item.original_text || item.contract_text || item.source_text || '',
          suggestion: item.suggestion || item.recommendation || item.advice || '',
        }))
      : [];

    const scoreValue = Number(outputs.risk_score ?? outputs.score ?? outputs.riskScore ?? 0);
    const fallback = this.buildAiAnalysis(contract);
    const parsedReport = reportText ? this.parseRiskAuditReport(reportText) : null;
    const mergedExtractedFields = this.mergeAiExtractedFields(
      fallback.extracted_fields,
      parsedReport?.extracted_fields || {},
      extractedFields,
    );

    return {
      score: Number.isFinite(scoreValue) && scoreValue > 0
        ? scoreValue
        : (parsedReport?.score || fallback.score),
      level: String(outputs.risk_level || outputs.riskLevel || outputs.level || parsedReport?.level || fallback.level),
      result: String(outputs.audit_result || outputs.result || outputs.auditConclusion || parsedReport?.result || fallback.result),
      summary: String(outputs.audit_summary || outputs.summary || outputs.conclusion || parsedReport?.summary || fallback.summary),
      issues: issues.length ? issues : (parsedReport?.issues.length ? parsedReport.issues : fallback.issues),
      extracted_fields: mergedExtractedFields,
      raw_outputs: outputs,
    };
  }

  private mergeAiExtractedFields(...sources: Array<Record<string, any> | undefined>) {
    const result: Record<string, any> = {};
    for (const source of sources) {
      if (!source || typeof source !== 'object') continue;
      for (const [key, value] of Object.entries(source)) {
        if (value == null) continue;
        if (typeof value === 'string' && value.trim() === '') continue;
        if (Array.isArray(value) && value.length === 0) continue;
        result[key] = value;
      }
    }
    return result;
  }

  private async finishAiAuditTask(task: ContractAiTask, payload?: any) {
    const contract = task.contract || (await this.getContractRecord(task.contract_id));
    const analysis: ContractAiAnalysis = payload
      ? this.extractAiAnalysisFromDify(contract, payload)
      : this.buildAiAnalysis(contract);

    await this.contractAiIssueRepository.delete({ contract_id: contract.id });
    if (analysis.issues.length > 0) {
      const issueEntities: ContractAiIssue[] = analysis.issues.map((item) =>
        this.contractAiIssueRepository.create({
          contract_id: contract.id,
          ...item,
        }),
      );
      await this.contractAiIssueRepository.save(issueEntities);
    }

    contract.status = ContractStatus.PENDING_MANUAL_REVIEW;
    contract.ai_risk_score = analysis.score;
    contract.ai_risk_level = analysis.level;
    contract.ai_audit_result = analysis.result;
    contract.ai_audit_summary = analysis.summary;
    contract.ai_extracted_fields = analysis.extracted_fields;
    contract.ai_last_task_id = task.task_id;
    contract.ai_last_audited_at = new Date().toISOString();
    await this.contractRepository.save(contract);

    task.status = ContractAiTaskStatus.SUCCESS;
    task.progress_message = 'AI审核完成，待人工复核';
    task.raw_response = payload || task.raw_response;
    await this.contractAiTaskRepository.save(task);
    await this.logOperation(contract.id, 'AI_AUDIT_FINISH', `AI审核完成，风险等级：${analysis.level}`, '系统');

    const latestTask = await this.contractAiTaskRepository.findOne({
      where: { task_id: task.task_id },
      relations: { contract: true },
    });
    return latestTask || task;
  }

  private buildAiAnalysis(contract: Contract): ContractAiAnalysis {
    const issues: ContractAiAnalysisIssue[] = [];
    let score = 92;

    if (!contract.refund_rule) {
      score -= 10;
      issues.push({
        risk_type: '退款条款',
        risk_level: '高',
        risk_description: '合同未明确退款规则，后续发生退团或取消时容易产生争议。',
        original_text: '未约定退款规则',
        suggestion: '补充阶梯退款规则，例如出团前30天免费退，30天内按比例扣费。',
      });
    }

    if (!contract.breach_liability) {
      score -= 8;
      issues.push({
        risk_type: '违约责任',
        risk_level: '中',
        risk_description: '合同未约定违约责任，出现履约异常时责任界定不清。',
        original_text: '未约定违约责任',
        suggestion: '增加违约责任条款，明确违约金、赔偿责任及处理时限。',
      });
    }

    if (contract.payment_type === ContractPaymentType.ADVANCE && Number(contract.advance_ratio || 0) > 50) {
      score -= 12;
      issues.push({
        risk_type: '付款条款',
        risk_level: '高',
        risk_description: `预付款比例 ${contract.advance_ratio}% 偏高，存在资金安全风险。`,
        original_text: `预付款比例 ${contract.advance_ratio}%`,
        suggestion: '建议将预付款比例控制在30%-50%，并增加节点验收条件。',
      });
    }

    if (contract.payment_type === ContractPaymentType.ACCOUNT_PERIOD && !contract.payment_cycle_days) {
      score -= 6;
      issues.push({
        risk_type: '账期条款',
        risk_level: '中',
        risk_description: '账期付款未明确账期天数。',
        original_text: '未约定账期天数',
        suggestion: '补充明确的账期天数，例如回团后30天付款。',
      });
    }

    if (!contract.end_date) {
      score -= 6;
      issues.push({
        risk_type: '有效期',
        risk_level: '中',
        risk_description: '合同未明确结束日期，合同有效期边界不清晰。',
        original_text: '未填写合同结束日期',
        suggestion: '补充合同结束日期，便于后续履约和到期提醒。',
      });
    }

    const level = score >= 90 ? '低风险' : score >= 70 ? '中风险' : '高风险';
    const result = score >= 90 ? '通过' : score >= 70 ? '需人工确认' : '高风险';
    const summary = issues.length === 0
      ? 'AI审核未发现明显风险，合同整体条款较完整，可进入人工复核。'
      : `AI审核识别出 ${issues.length} 个风险点，建议重点关注付款、退款及违约条款。`;

    return {
      score,
      level,
      result,
      summary,
      issues,
      extracted_fields: {
        contract_party: contract.supplier_name || '-',
        contract_type: contract.contract_type,
        resource_type: contract.resource_types || [],
        contract_amount: contract.amount || contract.annual_estimated_amount || 0,
        payment_type: contract.payment_type,
        advance_payment_ratio: contract.advance_ratio || null,
        payment_period_days: contract.payment_cycle_days || null,
        refund_rule: contract.refund_rule || '',
        breach_liability: contract.breach_liability || '',
        contract_validity: contract.start_date && contract.end_date
          ? `${contract.start_date} ~ ${contract.end_date}`
          : '',
      },
    };
  }

  private buildAuditFlow(contract: Contract) {
    const latestAiTask = [...(contract.ai_tasks || [])].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )[0];
    const latestManualAudit = [...(contract.audits || [])].sort(
      (a, b) => new Date(b.audit_time).getTime() - new Date(a.audit_time).getTime(),
    )[0];

    return [
      {
        node_name: '提交合同',
        operator: contract.owner_name || contract.created_by_name || '系统用户',
        status: contract.status === ContractStatus.DRAFT ? '待处理' : '已完成',
        operate_time: contract.created_at,
        comment: '合同已创建并进入审核流程',
      },
      {
        node_name: 'AI审核',
        operator: '系统',
        status: latestAiTask
          ? (latestAiTask.status === ContractAiTaskStatus.SUCCESS ? '已完成' : '处理中')
          : (contract.status === ContractStatus.SUBMITTED ? '待处理' : '未发起'),
        operate_time: latestAiTask?.updated_at || null,
        comment: latestAiTask?.progress_message || '待发起AI审核',
      },
      {
        node_name: '人工审核',
        operator: latestManualAudit?.audit_user_name || '审核人员',
        status: latestManualAudit
          ? (latestManualAudit.audit_status === ContractAuditStatus.PASS ? '已通过' : '已驳回')
          : (contract.status === ContractStatus.PENDING_MANUAL_REVIEW ? '待处理' : '未开始'),
        operate_time: latestManualAudit?.audit_time || null,
        comment: latestManualAudit?.audit_comment || '',
      },
      {
        node_name: '审批完成',
        operator: latestManualAudit?.audit_user_name || '系统',
        status: contract.status === ContractStatus.APPROVED ? '已完成' : '未完成',
        operate_time: contract.status === ContractStatus.APPROVED ? contract.updated_at : null,
        comment: contract.status === ContractStatus.APPROVED ? '合同审核通过' : '',
      },
      {
        node_name: '合同生效',
        operator: contract.owner_name || '系统',
        status: [ContractStatus.SIGNED, ContractStatus.ACTIVE].includes(contract.status) ? '已生效' : '未生效',
        operate_time: [ContractStatus.SIGNED, ContractStatus.ACTIVE].includes(contract.status) ? contract.updated_at : null,
        comment: [ContractStatus.SIGNED, ContractStatus.ACTIVE].includes(contract.status) ? '合同进入履约阶段' : '',
      },
    ];
  }

  private buildContractDetail(contract: Contract) {
    const fallbackExtractedFields = this.buildAiAnalysis(contract).extracted_fields;
    return {
      ...contract,
      audit_flow: this.buildAuditFlow(contract),
      ai_review: {
        task_id: contract.ai_last_task_id,
        risk_score: contract.ai_risk_score,
        risk_level: contract.ai_risk_level,
        audit_result: contract.ai_audit_result,
        summary: contract.ai_audit_summary,
        extracted_fields: this.mergeAiExtractedFields(fallbackExtractedFields, contract.ai_extracted_fields || {}),
        issues: (contract.ai_issues || []).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
      },
      operation_logs: (contract.operation_logs || []).sort(
        (a, b) => new Date(b.operation_time).getTime() - new Date(a.operation_time).getTime(),
      ),
      files: (contract.files || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
      versions: (contract.versions || []).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
      audits: (contract.audits || []).sort(
        (a, b) => new Date(b.audit_time).getTime() - new Date(a.audit_time).getTime(),
      ),
    };
  }

  private async logOperation(contractId: string, type: string, content: string, operatorName = '系统') {
    await this.contractOperationLogRepository.save(this.contractOperationLogRepository.create({
      contract_id: contractId,
      operator_name: operatorName,
      operation_type: type,
      operation_content: content,
    }));
  }

  private ensureEditable(contract: Contract) {
    if (![ContractStatus.DRAFT, ContractStatus.REJECTED].includes(contract.status)) {
      throw new BadRequestException('当前合同状态不允许编辑');
    }
  }

  private async getContractRecord(id: string) {
    const contract = await this.contractRepository.findOne({ where: { id } });
    if (!contract) {
      throw new BadRequestException('合同不存在');
    }
    return contract;
  }

  private validateBusinessFields(contract: Partial<CreateContractDto>) {
    if (contract.contract_type === ContractType.PROJECT) {
      if (!contract.project_name || !contract.order_name || !contract.quotation_name) {
        throw new BadRequestException('项目合同必须关联团队项目、采购订单和报价单');
      }
    }

    if (contract.contract_type === ContractType.FRAMEWORK) {
      if (!contract.cooperation_area || !contract.cooperation_scope) {
        throw new BadRequestException('框架合同必须填写合作区域和合作范围');
      }
    }

    if (contract.payment_type === ContractPaymentType.ADVANCE && contract.advance_ratio == null) {
      throw new BadRequestException('预付款合同必须填写预付比例');
    }

    if (contract.payment_type === ContractPaymentType.ACCOUNT_PERIOD && !contract.payment_cycle_days) {
      throw new BadRequestException('账期付款合同必须填写账期天数');
    }
  }
}
