-- Insert default settings
INSERT INTO loan_types (name, description) VALUES
    ('Home Loan', 'Loan for purchasing or constructing a home'),
    ('Mortgage Loan', 'Loan against property'),
    ('Personal Loan', 'Unsecured personal loan'),
    ('Business Loan', 'Loan for business purposes'),
    ('Car Loan', 'Loan for purchasing a vehicle');

INSERT INTO employee_types (name, description) VALUES
    ('Salaried', 'Salaried employee'),
    ('Self Employed', 'Self-employed professional or business owner'),
    ('Professional', 'Professional with independent practice'),
    ('Freelancer', 'Freelance worker');

INSERT INTO address_types (name) VALUES
    ('Home'),
    ('Office'),
    ('Registered Address'),
    ('Correspondence Address');

INSERT INTO bank_names (name, code) VALUES
    ('State Bank of India', 'SBI'),
    ('HDFC Bank', 'HDFC'),
    ('ICICI Bank', 'ICICI'),
    ('Axis Bank', 'AXIS'),
    ('Punjab National Bank', 'PNB'),
    ('Bank of Baroda', 'BOB'),
    ('Kotak Mahindra Bank', 'KOTAK'),
    ('IDFC First Bank', 'IDFC'),
    ('Yes Bank', 'YES'),
    ('IndusInd Bank', 'INDUS');

-- Insert default admin user (password: admin123 - should be hashed in production)
INSERT INTO users (name, email, password_hash, role) VALUES
    ('Super Admin', 'admin@example.com', '$2a$10$example_hash', 'super_admin'),
    ('Lead Manager', 'manager@example.com', '$2a$10$example_hash', 'lead_systems_manager'),
    ('DSA User', 'dsa@example.com', '$2a$10$example_hash', 'dsa');

-- Insert sample vendors
INSERT INTO vendors (owner_name, company_name, gst_number, office_address) VALUES
    ('Rajesh Verma', 'Verma Financial Services', '27AABCU9603R1ZV', '123 MG Road, Mumbai, Maharashtra 400001'),
    ('Priya Singh', 'Singh Loan Consultancy', '29AABCU9603R1ZW', '456 Park Street, Bangalore, Karnataka 560001');

-- Link vendors to loan types
INSERT INTO vendor_loan_types (vendor_id, loan_type_id) VALUES
    (1, 1), (1, 2), (1, 3),
    (2, 1), (2, 4);

-- Insert vendor bank commissions
INSERT INTO vendor_bank_commissions (vendor_id, bank_id, commission_percentage) VALUES
    (1, 1, 2.50), (1, 2, 2.75), (1, 3, 2.60),
    (2, 1, 2.40), (2, 4, 2.80), (2, 5, 2.55);

-- Insert sample leads
INSERT INTO leads (name, mobile_number, email, full_address, address_type_id, employee_type_id, loan_type_id, loan_amount, status) VALUES
    ('Amit Kumar', '+91 98765 43210', 'amit.kumar@example.com', '789 Nehru Nagar, Delhi 110001', 1, 1, 1, 5000000, 'pending'),
    ('Sneha Patel', '+91 87654 32109', 'sneha.patel@example.com', '321 Gandhi Road, Ahmedabad, Gujarat 380001', 2, 2, 2, 3500000, 'in_progress'),
    ('Rahul Sharma', '+91 76543 21098', 'rahul.sharma@example.com', '654 Anna Salai, Chennai, Tamil Nadu 600001', 1, 3, 3, 1500000, 'approved');

-- Insert sample company details
INSERT INTO company_details (company_name, registration_number, gst_number, pan_number, registered_address, contact_email, contact_phone, website) VALUES
    ('ABC Financial Services Pvt Ltd', 'U65999MH2020PTC123456', '27AABCA1234E1Z5', 'AABCA1234E', '100 Business Park, Mumbai, Maharashtra 400001', 'info@abcfinancial.com', '+91 22 1234 5678', 'https://abcfinancial.com');

-- Insert sample bank details
INSERT INTO bank_details (bank_name, account_number, ifsc_code, branch_name, account_holder_name, account_type) VALUES
    ('HDFC Bank', '50200012345678', 'HDFC0001234', 'Mumbai Main Branch', 'ABC Financial Services Pvt Ltd', 'Current Account');

-- Insert sample company processes
INSERT INTO company_processes (process_name, description, steps, department) VALUES
    ('Lead Onboarding', 'Process for onboarding new leads', '1. Receive lead information\n2. Verify contact details\n3. Assign to DSA\n4. Initial consultation\n5. Document collection', 'Operations'),
    ('Loan Application Processing', 'End-to-end loan processing workflow', '1. Application submission\n2. Document verification\n3. Credit check\n4. Bank submission\n5. Follow-up\n6. Approval/Rejection', 'Loan Processing');
