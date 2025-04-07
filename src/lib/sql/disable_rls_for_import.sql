-- Temporarily disable RLS on building_units table for data import
ALTER TABLE building_units DISABLE ROW LEVEL SECURITY;

-- Disable RLS on residents table as well to ensure smooth import
ALTER TABLE residents DISABLE ROW LEVEL SECURITY;

-- After running this, you can import your data without RLS constraints
-- Once import is complete, run the RLS policy setup scripts to re-enable security:
-- 1. Run src/lib/sql/building_units_rls_policy.sql
-- 2. Run src/lib/sql/fix_residents_recursive_policy.sql 