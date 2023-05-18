# Changelog

## [5.0.2](https://github.com/mljs/conrec/compare/v5.0.1...v5.0.2) (2023-05-18)


### Bug Fixes

* **types:** make return type of drawContour depend on contourDrawer ([#20](https://github.com/mljs/conrec/issues/20)) ([2471669](https://github.com/mljs/conrec/commit/24716692dd36c0dc6f7aafc8d87da069563e266e))

## [5.0.1](https://github.com/mljs/conrec/compare/v5.0.0...v5.0.1) (2023-05-18)


### Bug Fixes

* **types:** improve typings and allow typed arrays as inputs ([0e1a4c9](https://github.com/mljs/conrec/commit/0e1a4c9b328e8454248d58646ca6eddf37233984))

## [5.0.0](https://github.com/mljs/conrec/compare/v4.0.0...v5.0.0) (2023-05-12)


### ⚠ BREAKING CHANGES

* The contour lines are now returned in an object instead of an array with additional properties.

### Code Refactoring

* migrate project to TypeScript ([#17](https://github.com/mljs/conrec/issues/17)) ([3547522](https://github.com/mljs/conrec/commit/35475226cfec8708f855957a9bede77b886c0402))

## [4.0.0](https://github.com/mljs/conrec/compare/v3.2.1...v4.0.0) (2022-10-20)


### ⚠ BREAKING CHANGES

* return an object instead of throw error when timeout exceeded (#13)

### Code Refactoring

* return an object instead of throw error when timeout exceeded ([#13](https://github.com/mljs/conrec/issues/13)) ([22df7d4](https://github.com/mljs/conrec/commit/22df7d4f6308714f78fc0e8a9264ae458bb8feb3))

### [3.2.1](https://www.github.com/mljs/conrec/compare/v3.2.0...v3.2.1) (2021-08-30)


### Bug Fixes

* **types:** move swapAxes option to Conrec constructor ([643c197](https://www.github.com/mljs/conrec/commit/643c1977d10f8ca9e74e5e9f8ff09279c6daf535))

## [3.2.0](https://www.github.com/mljs/conrec/compare/v3.1.0...v3.2.0) (2021-02-28)


### Features

* improve speed ([d521b5f](https://www.github.com/mljs/conrec/commit/d521b5f2853042455e5a35e71b62bdc5f90896e4))

## [3.1.0](https://github.com/mljs/conrec/compare/v3.0.0...v3.1.0) (2021-02-26)


### Features

* improve speed ([28005aa](https://github.com/mljs/conrec/commit/28005aa2a3ce465d21793461155c642920ce526c))

# [3.0.0](https://github.com/mljs/conrec/compare/v2.0.0...v3.0.0) (2019-07-03)


### Features

* add a swapAxes option and swap the default axes ([#6](https://github.com/mljs/conrec/issues/6)) ([3341203](https://github.com/mljs/conrec/commit/3341203))


### BREAKING CHANGES

* In previous versions, the X axis was along the rows of the data matrix
and the Y axis along the columns. This was not intuitive regarding how
the contours are then drawn. The default was changed to now consider X
along the columns and Y along the rows respectively.
Pass `swapAxes: true` to the Conrec constructor to get the previous
behavior.



# [2.0.0](https://github.com/mljs/conrec/compare/v1.0.0...v2.0.0) (2019-05-16)


### Code Refactoring

* rewrite project is ESM ([4754f86](https://github.com/mljs/conrec/commit/4754f86))


### BREAKING CHANGES

* The Conrec class is now a named export.



<a name="1.0.0"></a>
# [1.0.0](https://github.com/mljs/conrec/compare/v0.0.2...v1.0.0) (2016-07-21)


### Features

* add timeout option ([a3f1861](https://github.com/mljs/conrec/commit/a3f1861))



<a name="0.0.2"></a>
## 0.0.2 (2016-07-12)
