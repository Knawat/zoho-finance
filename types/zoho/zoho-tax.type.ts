export interface ZohoTax {
  tax_id: string;
  tax_name?: string;
  tax_amount?: number;
  tax_percentage?: number;
  tax_type?: 'tax' | 'compound_tax';
  is_editable?: boolean;
}
