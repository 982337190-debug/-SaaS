CREATE DATABASE IF NOT EXISTS travel_supply DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE travel_supply;

INSERT INTO roles (id, name, code, description, created_at, updated_at) VALUES
('1', '管理员', 'admin', '系统管理员，拥有所有权限', NOW(), NOW()),
('2', '销售', 'sales', '销售角色，负责客户管理和报价', NOW(), NOW()),
('3', 'OP', 'op', '计调角色，负责团队操作和行程安排', NOW(), NOW()),
('4', '采购', 'procurement', '采购角色，负责资源采购和询价', NOW(), NOW()),
('5', '财务', 'finance', '财务角色，负责结算和成本管理', NOW(), NOW());

INSERT INTO permissions (id, name, code, module, description, created_at, updated_at) VALUES
('1', '查看报价', 'quote:view', '报价管理', '查看报价列表和详情', NOW(), NOW()),
('2', '创建报价', 'quote:create', '报价管理', '创建新报价', NOW(), NOW()),
('3', '编辑报价', 'quote:edit', '报价管理', '编辑报价信息', NOW(), NOW()),
('4', '审批报价', 'quote:approve', '报价管理', '审批报价', NOW(), NOW()),
('5', '导出报价', 'quote:export', '报价管理', '导出报价数据', NOW(), NOW()),

('6', '查看团组', 'team:view', '团组管理', '查看团组列表和详情', NOW(), NOW()),
('7', '创建团组', 'team:create', '团组管理', '创建新团组', NOW(), NOW()),
('8', '编辑团组', 'team:edit', '团组管理', '编辑团组信息', NOW(), NOW()),
('9', '团组操作', 'team:operate', '团组管理', '团组收客、发团等操作', NOW(), NOW()),
('10', '导出团组', 'team:export', '团组管理', '导出团组数据', NOW(), NOW()),

('11', '查看采购', 'procurement:view', '采购管理', '查看采购列表和详情', NOW(), NOW()),
('12', '创建采购', 'procurement:create', '采购管理', '创建采购需求', NOW(), NOW()),
('13', '编辑采购', 'procurement:edit', '采购管理', '编辑采购信息', NOW(), NOW()),
('14', '询价确认', 'procurement:confirm', '采购管理', '确认供应商报价', NOW(), NOW()),

('15', '查看资源', 'resource:view', '资源库', '查看资源列表', NOW(), NOW()),
('16', '创建资源', 'resource:create', '资源库', '创建新资源', NOW(), NOW()),
('17', '编辑资源', 'resource:edit', '资源库', '编辑资源信息', NOW(), NOW()),
('18', '删除资源', 'resource:delete', '资源库', '删除资源', NOW(), NOW()),

('19', '查看行程', 'itinerary:view', '行程管理', '查看行程列表和详情', NOW(), NOW()),
('20', '创建行程', 'itinerary:create', '行程管理', '创建新行程', NOW(), NOW()),
('21', '编辑行程', 'itinerary:edit', '行程管理', '编辑行程信息', NOW(), NOW()),

('22', '查看客户', 'customer:view', '客户管理', '查看客户列表', NOW(), NOW()),
('23', '创建客户', 'customer:create', '客户管理', '创建新客户', NOW(), NOW()),
('24', '编辑客户', 'customer:edit', '客户管理', '编辑客户信息', NOW(), NOW()),
('25', '删除客户', 'customer:delete', '客户管理', '删除客户', NOW(), NOW()),

('26', '查看用户', 'user:view', '系统管理', '查看用户列表', NOW(), NOW()),
('27', '创建用户', 'user:create', '系统管理', '创建新用户', NOW(), NOW()),
('28', '编辑用户', 'user:edit', '系统管理', '编辑用户信息', NOW(), NOW()),
('29', '删除用户', 'user:delete', '系统管理', '删除用户', NOW(), NOW()),

('30', '查看角色', 'role:view', '系统管理', '查看角色列表', NOW(), NOW()),
('31', '创建角色', 'role:create', '系统管理', '创建新角色', NOW(), NOW()),
('32', '编辑角色', 'role:edit', '系统管理', '编辑角色信息', NOW(), NOW()),
('33', '删除角色', 'role:delete', '系统管理', '删除角色', NOW(), NOW()),

('34', '区域OP设置', 'region:op', '系统管理', '设置区域与OP的对应关系', NOW(), NOW());

INSERT INTO role_permissions (role_id, permission_id) VALUES
('1', '1'), ('1', '2'), ('1', '3'), ('1', '4'), ('1', '5'),
('1', '6'), ('1', '7'), ('1', '8'), ('1', '9'), ('1', '10'),
('1', '11'), ('1', '12'), ('1', '13'), ('1', '14'),
('1', '15'), ('1', '16'), ('1', '17'), ('1', '18'),
('1', '19'), ('1', '20'), ('1', '21'),
('1', '22'), ('1', '23'), ('1', '24'), ('1', '25'),
('1', '26'), ('1', '27'), ('1', '28'), ('1', '29'),
('1', '30'), ('1', '31'), ('1', '32'), ('1', '33'), ('1', '34'),

('2', '1'), ('2', '2'), ('2', '3'), ('2', '5'),
('2', '6'), ('2', '7'), ('2', '8'), ('2', '10'),
('2', '22'), ('2', '23'), ('2', '24'),

('3', '6'), ('3', '7'), ('3', '8'), ('3', '9'), ('3', '10'),
('3', '11'), ('3', '12'), ('3', '13'),
('3', '15'), ('3', '19'), ('3', '20'), ('3', '21'),

('4', '11'), ('4', '12'), ('4', '13'), ('4', '14'),
('4', '15'), ('4', '16'), ('4', '17'),

('5', '1'), ('5', '6'), ('5', '11');

INSERT INTO users (id, username, phone, password, email, role_id, status, created_at, updated_at) VALUES
('1', 'admin', '13800138000', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IjzqAKL9xL5jvMFVdNJHvGCgTq/VEq', 'admin@travel.com', '1', 'active', NOW(), NOW());

INSERT INTO region_ops (id, region, op_user_id, created_at, updated_at) VALUES
('1', '日本', '1', NOW(), NOW()),
('2', '韩国', '1', NOW(), NOW()),
('3', '泰国', '1', NOW(), NOW()),
('4', '新加坡', '1', NOW(), NOW()),
('5', '马来西亚', '1', NOW(), NOW()),
('6', '欧洲', '1', NOW(), NOW()),
('7', '美国', '1', NOW(), NOW()),
('8', '澳大利亚', '1', NOW(), NOW());