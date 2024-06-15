export const calculatePaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    if (page > totalPages) {
        return { page: 1, perPage, totalAmountOfContacts: count, totalPages, hasNextPage, hasPrevPage };
    }
    return {page, perPage, totalAmountOfContacts:count, totalPages,hasNextPage, hasPrevPage};
};
