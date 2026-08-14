import type { StringifiableRecord } from "query-string";
import type {
  BaseRecord,
  CreateParams,
  CreateResponse,
  CrudFilter,
  CrudSort,
  DataProvider,
  DeleteOneParams,
  DeleteOneResponse,
  GetListParams,
  GetListResponse,
  GetManyParams,
  GetManyResponse,
  GetOneParams,
  GetOneResponse,
  LogicalFilter,
  Pagination,
  UpdateParams,
  UpdateResponse,
} from "@refinedev/core";
import { httpService } from "../services/httpService";

const DEFAULT_PAGINATION: Pagination = { currentPage: 1, pageSize: 10 };
const DEFAULT_SORT: CrudSort[] = [{ field: "id", order: "asc" }];

const isLogicalFilter = (filter: CrudFilter): filter is LogicalFilter => {
  return "field" in filter;
};



const buildListQuery = (
  pagination?: Pagination,
  sorters?: CrudSort[],
  filters?: CrudFilter[],
): StringifiableRecord => {
  const query: StringifiableRecord = {
    page: pagination?.currentPage ?? 1,
    perPage: pagination?.pageSize ?? 10,
  };

  const sort = sorters?.[0];
  if (sort) {
    query.sortBy = sort.field;
    query.sortDir = sort.order.toUpperCase();
  }

  const filter = filters?.find(
    (f): f is LogicalFilter => isLogicalFilter(f) && f.operator === "eq",
  );

  const searchFilter = filters?.find(
    (f): f is LogicalFilter => isLogicalFilter(f) && f.field === "search",
  );

  if (searchFilter) {
    query.search = String(searchFilter.value);
  }

  if (filter && filter.field !== "search") {
    query.filterBy = filter.field;
    query.filterValue = String(filter.value);
  }

  return query;
};

const extractTotalCount = (response: Response): number => {
  return Number(response.headers.get("x-total-count")) || 0;
};

const fetchList = async <TData extends BaseRecord = BaseRecord>(
  resource: string,
  pagination: Pagination,
  sorters: CrudSort[],
  filters: CrudFilter[],
): Promise<{ data: TData[]; total: number }> => {
  const query = buildListQuery(pagination, sorters, filters);
  const response = await httpService.request(`/${resource}`, { query });
  const data = await httpService.parseBody<TData[]>(response);
  const total = extractTotalCount(response);
  return { data, total };
};

export const dataProvider: DataProvider = {
  async getList<TData extends BaseRecord = BaseRecord>(
  params: GetListParams,
): Promise<GetListResponse<TData>> {
  const { resource, pagination, sorters, filters } = params;
  return fetchList<TData>(
    resource,
    pagination ?? DEFAULT_PAGINATION,
    sorters ?? DEFAULT_SORT,
    filters ?? [],
  );
},

  async getOne<TData extends BaseRecord = BaseRecord>(
  params: GetOneParams,
): Promise<GetOneResponse<TData>> {
  return { data: await httpService.fetchJson<TData>(`/${params.resource}/${params.id}`) };
},

async getMany<TData extends BaseRecord = BaseRecord>(
  params: GetManyParams,
): Promise<GetManyResponse<TData>> {
  return {
    data: await httpService.fetchJson<TData[]>(`/${params.resource}`, {
      query: {
        filterBy: "ids",
        filterValue: params.ids.join(","),
        perPage: params.ids.length,
        page: 1,
      },
    }),
  };
},

  async create<TData extends BaseRecord = BaseRecord, TVariables = {}>(
  params: CreateParams<TVariables>,
): Promise<CreateResponse<TData>> {
  return {
    data: await httpService.fetchJson<TData>(`/${params.resource}`, {
      method: "POST",
      body: params.variables,
    }),
  };
},

  async update<TData extends BaseRecord = BaseRecord, TVariables = {}>(
  params: UpdateParams<TVariables>,
): Promise<UpdateResponse<TData>> {
  return {
    data: await httpService.fetchJson<TData>(`/${params.resource}/${params.id}`, {
      method: "PATCH",
      body: params.variables,
    }),
  };
},

async deleteOne<TData extends BaseRecord = BaseRecord, TVariables = {}>(
  params: DeleteOneParams<TVariables>,
): Promise<DeleteOneResponse<TData>> {
  await httpService.fetchJson(`/${params.resource}/${params.id}`, {
    method: "DELETE",
  });

  return { data: { id: params.id } as unknown as TData };
},

  getApiUrl: () => import.meta.env.VITE_API_URL,
};
