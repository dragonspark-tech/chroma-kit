/**
 * Represents a 3x3 matrix with numerical values. The matrix is defined as a 2D array with three rows and three columns.
 * Each element in the matrix is a number. It is commonly used in mathematical operations such as transformations,
 * vector calculations, and graphics computations.
 *
 * Example structure:
 * [
 *   [a, b, c],
 *   [d, e, f],
 *   [g, h, i]
 * ]
 *
 * Where each letter represents a numerical value in the matrix.
 */
export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

/**
 * Multiplies a matrix by a vector and returns the resulting vector.
 *
 * This function computes the product of a matrix and a vector. It ensures that
 * the matrix and vector have compatible dimensions, where each row of the matrix
 * must have the same number of columns as the size of the vector.
 *
 * Throws an error if the matrix or vector is empty, or if the rows of the matrix
 * do not match the length of the vector.
 *
 * @param {number[][]} matrix - A 2D array representing the matrix to be multiplied.
 * @param {number[]} vector - A 1D array representing the vector to be multiplied.
 * @param {number[]} [result] - An optional pre-allocated array to store the resulting vector.
 * @returns {number[]} - The resulting vector after the matrix-vector multiplication.
 * @throws {Error} Throws an error if the matrix or vector is empty, or if their dimensions are incompatible.
 */
export const multiplyMatrixByVector = (
  matrix: number[][],
  vector: number[],
  result?: number[]
): number[] => {
  if (matrix.length === 0 || vector.length === 0) {
    throw new Error('Matrix and vector must have valid non-empty dimensions.');
  }

  const numRows = matrix.length;
  const colsPerRow = vector.length;

  for (const row of matrix) {
    if (row.length !== colsPerRow) {
      throw new Error("All matrix rows must match the vector's length.");
    }
  }

  result = result || new Array(numRows);

  for (let i = 0; i < numRows; i++) {
    const row = matrix[i];
    let sum = 0;
    for (let j = 0; j < colsPerRow; j++) {
      sum += row[j] * vector[j];
    }
    result[i] = sum;
  }

  return result;
};

/**
 * Transposes a 3x3 matrix.
 *
 * Accepts a two-dimensional array representing a 3x3 matrix and returns a new matrix
 * where the rows and columns are swapped.
 *
 * @param {Matrix3x3} matrix - A 3x3 matrix represented as a two-dimensional array.
 * @returns {Matrix3x3} A new 3x3 matrix that is the transpose of the input matrix.
 */
export const transposeMatrix3x3 = (matrix: Matrix3x3): Matrix3x3 => {
  return [
    [matrix[0][0], matrix[1][0], matrix[2][0]],
    [matrix[0][1], matrix[1][1], matrix[2][1]],
    [matrix[0][2], matrix[1][2], matrix[2][2]]
  ];
};

/**
 * Multiplies two 3x3 matrices and returns the result as a new 3x3 matrix.
 *
 * @param {Matrix3x3} a - The first 3x3 matrix.
 * @param {Matrix3x3} b - The second 3x3 matrix.
 * @returns {Matrix3x3} - The resulting 3x3 matrix after multiplication.
 */
export const multiplyMatrix3x3 = (a: Matrix3x3, b: Matrix3x3): Matrix3x3 => [
  [
    a[0][0] * b[0][0] + a[0][1] * b[1][0] + a[0][2] * b[2][0],
    a[0][0] * b[0][1] + a[0][1] * b[1][1] + a[0][2] * b[2][1],
    a[0][0] * b[0][2] + a[0][1] * b[1][2] + a[0][2] * b[2][2]
  ],
  [
    a[1][0] * b[0][0] + a[1][1] * b[1][0] + a[1][2] * b[2][0],
    a[1][0] * b[0][1] + a[1][1] * b[1][1] + a[1][2] * b[2][1],
    a[1][0] * b[0][2] + a[1][1] * b[1][2] + a[1][2] * b[2][2]
  ],
  [
    a[2][0] * b[0][0] + a[2][1] * b[1][0] + a[2][2] * b[2][0],
    a[2][0] * b[0][1] + a[2][1] * b[1][1] + a[2][2] * b[2][1],
    a[2][0] * b[0][2] + a[2][1] * b[1][2] + a[2][2] * b[2][2]
  ]
];

/**
 * Transposes a given 2D matrix by flipping it's rows and columns.
 * When working with 3x3 matrices, use {@linkcode transposeMatrix3x3} instead for better performance.
 *
 * @param {number[][]} matrix - A two-dimensional array of numbers representing the matrix to be transposed.
 * @returns {number[][]} A new two-dimensional array representing the transposed matrix.
 */
export const transposeMatrix = (matrix: number[][]): number[][] => {
  const rows = matrix.length;
  if (rows === 0) return [];
  const cols = matrix[0].length;
  const transposed: number[][] = new Array(cols);
  for (let j = 0; j < cols; j++) {
    transposed[j] = new Array(rows);
    for (let i = 0; i < rows; i++) {
      transposed[j][i] = matrix[i][j];
    }
  }
  return transposed;
};

/**
 * Multiplies two matrices and returns the resulting matrix. When working with 3x3 matrices,
 * use {@linkcode multiplyMatrix3x3} instead for better performance.
 *
 * @param {number[][]} a - The first matrix to be multiplied. It should be a 2-dimensional array where each sub-array represents a row.
 * @param {number[][]} b - The second matrix to be multiplied. It should be a 2-dimensional array where each sub-array represents a row.
 * @returns {number[][]} The resulting matrix after multiplication. Each sub-array represents a row of the resulting matrix.
 * @throws {Error} Throws an error if the number of columns in the first matrix does not match the number of rows in the second matrix.
 */
export const multiplyMatrix = (a: number[][], b: number[][]): number[][] => {
  const aRows = a.length;
  const aCols = aRows ? a[0].length : 0;
  const bRows = b.length;
  const bCols = bRows ? b[0].length : 0;

  if (aCols !== bRows) {
    throw new Error('Matrix dimensions are incompatible for multiplication.');
  }

  if (aRows === 3 && aCols === 3 && bRows === 3 && bCols === 3) {
    return multiplyMatrix3x3(a as Matrix3x3, b as Matrix3x3);
  }

  const result: number[][] = new Array(aRows);
  const tB = transposeMatrix(b);

  for (let i = 0; i < aRows; i++) {
    const rowA = a[i];
    const resRow = new Array(bCols);
    for (let j = 0; j < bCols; j++) {
      const rowB = tB[j];
      let sum = 0;
      for (let k = 0; k < aCols; k++) {
        sum += rowA[k] * rowB[k];
      }
      resRow[j] = sum;
    }
    result[i] = resRow;
  }
  return result;
};

/**
 * Multiplies multiple matrices together in the provided sequence.
 *
 * The matrix product is calculated by multiplying them sequentially
 * from left to right. 3x3 matrices will use the {@linkcode multiplyMatrix3x3} function
 * for better performance.
 *
 * @param {...number[][][]} matrices - An array of matrices to multiply. Each matrix is represented as a 2D array.
 * @returns {number[][]} The resulting matrix from the multiplication of all input matrices.
 * @throws {Error} Throws an error if no matrices are provided.
 */
export const multiplyMatrices = (...matrices: number[][][]): number[][] => {
  if (matrices.length === 0) {
    throw new Error('No matrices provided for multiplication.');
  }

  if (matrices.length === 1) {
    return matrices[0];
  }

  let result = multiplyMatrix(matrices[0], matrices[1]);

  for (let i = 2; i < matrices.length; i++) {
    result = multiplyMatrix(result, matrices[i]);
  }

  return result;
};
