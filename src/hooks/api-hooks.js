// src/hooks/api-hooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAPI, projectAPI, bannerAPI, newsAPI, specificationAPI, companyAPI} from '@/lib/api-client';

// Product Hooks
export const useProducts = (filters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productAPI.getProducts(filters),
    select: (response) => ({
      data: response?.data?.data || [],
      meta: response?.data?.meta || {},
      total: response?.data?.meta?.totalItems || 0
    }),
    enabled: !!filters, // Only run query when filters is not null
    keepPreviousData: true,
  });
};



// Company Settings Hook
export const useCompanySettings = () => {
  return useQuery({
    queryKey: ['companySettings'],
    queryFn: companyAPI.getSettings,
    select: (response) => {
      // Log the full response to understand its structure
      console.log("Raw company settings response:", response);
      
      // Properly extract the data from the nested structure
      return response?.data || null;
    },
  });
};


export const useProductSpecifications = () => {
  return useQuery({
    queryKey: ['productSpecifications'],
    queryFn: productAPI.getSpecifications,
    select: (response) => response?.data || [],
  });
};


export const useProductTypes = () => {
  return useQuery({
    queryKey: ['productTypes'],
    queryFn: productAPI.getTypes,
    select: (response) => {
      console.log('Product Types Response:', response);
      return response?.data || [];
    }
  });
};


// Project Hooks
export const useProjects = (filters) => {
  return useQuery({
      queryKey: ['projects', filters],
      queryFn: () => projectAPI.getAll({
          page: filters.page || 1,
          limit: filters.limit || 12,
          project_category: filters.project_category || [],
          product_type: filters.product_type || [],
          product_category: filters.product_category || [],
          product_group: filters.product_group || [],
          sort: filters.sort || 'asc'
      }),
      keepPreviousData: true
  });
};

export const useProject = (id) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => projectAPI.getById(id),
    enabled: !!id,
  });
};

export const useProjectCategories = () => {
  return useQuery({
    queryKey: ['projectCategories'],
    queryFn: projectAPI.getCategories,
  });
};

// Banner Hooks
export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: bannerAPI.getAll,
  });
};

// News Hooks
export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: newsAPI.getAll,
  });
};

export const useNewsArticle = (id) => {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsAPI.getById(id),
    enabled: !!id,
  });
};

//////////////////////////

export const useFilteredProducts = (filters) => {
  return useQuery({
    queryKey: ['filteredProducts', filters],
    queryFn: () => productAPI.getFilteredProducts(filters),
    keepPreviousData: true,
  });
};

export const useProductShowcase = (type) => {
  return useQuery({
    queryKey: ['productShowcase', type],
    queryFn: () => productAPI.getShowcaseCategories(type),
    enabled: !!type,
  });
};



export const useNewProducts = () => {
  return useQuery({
    queryKey: ['newProducts'],
    queryFn: productAPI.getNewProducts,
  });
};

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => projectAPI.getCategories(),
    select: (response) => response?.data || []
  });
};
export const useProductSearch = (productName) => {
  return useQuery({
    queryKey: ['productSearch', productName],
    queryFn: () => productAPI.searchByName(productName),
    enabled: !!productName,
    select: (response) => response?.data || null
  });
};

export const useProductDetail = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id),
    select: (response) => ({
      data: response?.data,
      specifications: response?.data?.specifications || {},
      optional: response?.data?.optional || {},
      resources: response?.data?.resources || []
    }),
    enabled: !!id
  });
};

export const useProductCategories = (params) => {
  return useQuery({
    queryKey: ['productCategories', params],
    queryFn: () => productAPI.getCategories(params),
    select: (response) => response?.data || [],
    enabled: !!params, // Only run query when params is not null
  });
};

export const useProductCategoriesNew = (params) => {
  return useQuery({
    queryKey: ['productCategories', params],
    queryFn: () => productAPI.getCategories(params),
    select: (response) => response?.data || []
  });
};
export const useProductGroups = () => {
  return useQuery({
    queryKey: ['productGroups'],
    queryFn: productAPI.getGroups,
    select: (response) => response?.data || []
  });
};

export const useProductApplications = () => {
  return useQuery({
    queryKey: ['productApplications'],
    queryFn: productAPI.getApplications,
    select: (response) => response?.data || []
  });
};

export const useAbout = () => {
  return useQuery({
    queryKey: ['about'],
    queryFn: aboutAPI.getAll,
    select: (response) => ({
      data: response?.data?.[0] || null,
      isLoading: false,
      error: null
    })
  });
};



export const useSpecifications = () => {
  return useQuery({
    queryKey: ['specifications'],
    queryFn: specificationAPI.getAll,
    select: (response) => response?.data || []
  });
};

export const useSpecification = (id) => {
  return useQuery({
    queryKey: ['specification', id],
    queryFn: () => specificationAPI.getById(id),
    enabled: !!id,
    select: (response) => response?.data
  });
};

export const useSpecificationValues = () => {
  return useQuery({
    queryKey: ['specificationValues'],
    queryFn: specificationAPI.getItemValues,
    select: (response) => response?.data || []
  });
};

export const useSpecificationCategories = () => {
  return useQuery({
    queryKey: ['specificationCategories'],
    queryFn: specificationAPI.getCategories,
    select: (response) => response?.data || []
  });
};