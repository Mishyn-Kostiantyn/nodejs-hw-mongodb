export const calculatePaginationData = (count, page, perPage) => {
    const totalPages = Math.ceil(count / perPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return {page, perPage, totalAmountOfContacts:count, totalPages,hasNextPage, hasPrevPage};
 };