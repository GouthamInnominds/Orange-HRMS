-- Reversible rollback script for OrangeHRM India-Standard Payroll Extension v2.2
-- Restores schema prior to v2.2 new tables without touching core HR tables.

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `ohrm_payroll_audit_event`;
DROP TABLE IF EXISTS `ohrm_payroll_approval`;
DROP TABLE IF EXISTS `ohrm_payroll_claim_link`;
DROP TABLE IF EXISTS `ohrm_payroll_payment_batch`;
DROP TABLE IF EXISTS `ohrm_payroll_emp_snapshot`;
DROP TABLE IF EXISTS `ohrm_payroll_emp_profile`;
DROP TABLE IF EXISTS `ohrm_payroll_leave_policy`;
DROP TABLE IF EXISTS `ohrm_payroll_tax_bracket`;
DROP TABLE IF EXISTS `ohrm_payroll_statutory_rule`;
DROP TABLE IF EXISTS `ohrm_payroll_config`;
DROP TABLE IF EXISTS `ohrm_payroll_run`;

UPDATE `ohrm_menu_item` SET `additional_params` = '{"icon":"briefcase"}' WHERE `menu_title` = 'Payroll' AND `parent_id` IS NULL;

DELETE FROM `ohrm_api_permission` WHERE `api_name` LIKE 'OrangeHRM\\Payroll\\Api\\%';
DELETE urdg FROM `ohrm_user_role_data_group` urdg INNER JOIN `ohrm_data_group` dg ON dg.id = urdg.data_group_id WHERE dg.name LIKE 'payroll_%' OR dg.name LIKE 'apiv2_payroll_%';
DELETE FROM `ohrm_data_group` WHERE `name` LIKE 'payroll_%' OR `name` LIKE 'apiv2_payroll_%';

SET FOREIGN_KEY_CHECKS = 1;

