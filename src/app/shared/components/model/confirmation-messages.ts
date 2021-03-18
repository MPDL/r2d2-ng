export const confirm_delete_container = (id) => {
    return `
    You're about to DELETE the container
    ${id}
    from the object store!
    This will permanently delete the entire
    content inside the container as well.
    `;
};

export const confirm_delete_dataset = (id) => {
    return `
    You're about 2 completely DELETE the dataset
    ${id}
    This will include any vaersion and ALL files
    attached to a version!
    `;
};
