/**
 * @description A node like require object.
 * @author Jaenster
 */

global['module'] = {exports: undefined};
const require = (function (include,isIncluded) {
    let depth = 0;
    let packages = {};
    return (field, path) => {

        path = path || 'modules/';
        let packageName = (path + field).replace(/[^a-z0-9]/gi, '_').toLowerCase();

        if (packages.hasOwnProperty(packageName)) {
            depth && print('ÿc2Jaensterÿc0 ::    - retrieving cached module: ' + field);
            return packages[packageName].exports;
        }

        if (!isIncluded(path + field + '.js')) {
            depth && print('ÿc2Jaensterÿc0 ::    - loading dependency: ' + field);
            !depth && print('ÿc2Jaensterÿc0 :: Loading module: ' + field);
            depth++;

            let old = Object.create(global['module']);
            delete global['module'];
            global['module'] = {exports: {here: 'failed module'}};

            // Include the file;
            try {
                if (!include(path + field + '.js')) {
                    throw Error('module ' + field + ' not found');
                }
            } finally {
                depth--
            }

            packages[packageName] = Object.create(global['module']);
            delete global['module'];

            global['module'] = old;
            return packages[packageName].exports;
        }
        throw Error('unexpected module error -- ' + field);
    }
})(include,isIncluded);