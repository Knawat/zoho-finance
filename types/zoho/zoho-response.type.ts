/**
 * ZohoResponse - types to define response from zoho
 *
 * @export
 * @interface ZohoResponse
 */
export type ZohoResponse<T> = { [P in keyof T]: T[P] } & {
  code: number;
  message: string;
  page_context: {
    page: number;
    per_page: number;
    has_more_page: boolean;
    report_name: number;
    applied_filter: number;
    sort_column: number;
    sort_order: number;
    search_criteria: [
      {
        column_name: number;
        search_text: number;
        search_text_formatted: number;
        comparator: number;
      }
    ];
  };
};
