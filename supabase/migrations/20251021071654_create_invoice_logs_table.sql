/*
  # Create invoice logs table

  1. New Tables
    - `invoice_logs`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `filename` (text) - Name of the uploaded invoice file
      - `file_size` (bigint) - Size of the file in bytes
      - `status` (text) - Current status: 'uploading', 'processing', 'completed', 'failed'
      - `error_message` (text, nullable) - Error details if upload/processing failed
      - `uploaded_at` (timestamptz) - Timestamp when file was uploaded
      - `completed_at` (timestamptz, nullable) - Timestamp when processing completed
      - `created_at` (timestamptz) - Record creation timestamp
      
  2. Security
    - Enable RLS on `invoice_logs` table
    - Add policy for anonymous users to insert their own logs
    - Add policy for anonymous users to read all logs (for demo purposes)
    
  3. Notes
    - This is a demo app, so we allow anonymous access
    - In production, you would restrict access to authenticated users only
*/

CREATE TABLE IF NOT EXISTS invoice_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'uploading',
  error_message text,
  uploaded_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE invoice_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous to insert logs"
  ON invoice_logs
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous to read logs"
  ON invoice_logs
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous to update logs"
  ON invoice_logs
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
