/*
  # Add invoice details columns

  1. Changes
    - Add `amount` column to store monetary value of the invoice
    - Add `document_type` column to distinguish between sales and purchases
    - Add `extracted_data` column to store full JSON data for editing
    
  2. Notes
    - Amount is stored as numeric for accurate calculations
    - Document type is either 'Sale' or 'Purchase'
    - Extracted data stores the full invoice details as JSONB
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoice_logs' AND column_name = 'amount'
  ) THEN
    ALTER TABLE invoice_logs ADD COLUMN amount numeric(10,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoice_logs' AND column_name = 'document_type'
  ) THEN
    ALTER TABLE invoice_logs ADD COLUMN document_type text DEFAULT 'Purchase';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'invoice_logs' AND column_name = 'extracted_data'
  ) THEN
    ALTER TABLE invoice_logs ADD COLUMN extracted_data jsonb;
  END IF;
END $$;
