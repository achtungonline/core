function getSingletonPackageNames(singletons) {
    return singletons.filter((s) => s.packageName).map((s) => s.packageName);
}

function getSingletonGlobalNames(singletons) {
    return singletons.filter((s) => s.globalName).map((s) => s.globalName);
}

function getSingletonPaths(singletons) {
    return singletons.map((s) => s.path);
}

function getSingletonProdPaths(singletons) {
    return singletons.map((s) => s.pathProd || s.path);
}

module.exports = {
    getSingletonPackageNames: getSingletonPackageNames,
    getSingletonGlobalNames: getSingletonGlobalNames,
    getSingletonPaths: getSingletonPaths,
    getSingletonProdPaths: getSingletonProdPaths
};
