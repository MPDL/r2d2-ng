const cloneObject = (obj) =>
    (Array.isArray(obj) ? Object.values : (the_obj) => the_obj)
    (Object.entries(obj).reduce((acc, [key, val]) =>
        ({
            ...acc, [key]: (
                !val ? val
                    : typeof val === 'object' ? cloneObject(val)
                        : val
            ),
        }),
        {},
    ));

const checkObjectType = (obj) =>
    // Object(obj) === obj && !Array.isArray(obj)
    // obj instanceof Object && !(obj instanceof Array) && obj !== null
    typeof obj === 'object' && obj !== null && !Array.isArray(obj);

const joinKeys = (...keys2join) =>
    keys2join.join('.');

const listKeys = (obj, keys = []) =>
    Object.keys(obj).reduce((acc, key) =>
        checkObjectType(obj[key])
            ? [...acc, ...listKeys(obj[key], [...keys, key])]
            : [...acc, joinKeys(...keys, key)]
        , [],
    );

const renameKeys = (obj, map) =>
    (Object.keys(obj).reduce((acc, key) => {
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map((item) => renameKeys(item, map));
        } else if (typeof obj[key] === 'object') {
            obj[key] = renameKeys(obj[key], map);
        }
        return {
            ...acc, [map[key] || key]: obj[key],
        };
    }, {}));


const renameKeysXXX = (obj, map) =>
    (Array.isArray(obj) ? Object.values : the_obj => the_obj)
        (Object.keys(obj).reduce((acc, key) =>
            ({
                ...acc, [map[key] || key]: (
                    (typeof obj[key] === 'object') ?
                        obj[key] = renameKeysXXX(obj[key], map)
                        : obj[key]
                )
            }), {}));

export {
    cloneObject,
    listKeys,
    renameKeys,
    renameKeysXXX,
};
