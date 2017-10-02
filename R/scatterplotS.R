#' scatterplotS
#'
#' @param l A list of matrices
#'
#' @return An htmlwidget
#'
#' @import htmlwidgets
#'
#' @export
scatterplotS <- function (l) {
  stages <- length(l)
  pnum <- nrow(l[[1]])

  r <- vector('numeric')
  c <- vector('numeric')
  for (j in stages) {
    r = c(r, nrow(l[[j]]))
    c = c(c, ncol(l[[j]]))
  }

  if (!min(c) == 3 || !max(c) == 3) stop("Each matrix must have exactly 3 columns")
  if (!all.equal(min(r), max(r))) stop("All matrices must have same number of rows.")

  X <- vector('numeric')
  Y <- vector('numeric')
  Z <- vector('numeric')
  for (i in 1:stages) {
    X = c(X, l[[i]][,1])
    Y = c(Y, l[[i]][,2])
    Z = c(Z, l[[i]][,3])
  }

  x <- list(
    X = X,
    Y = Y,
    Z = Z,
    stages = stages,
    pnum = pnum
  )

  # create widget
  htmlwidgets::createWidget(
    "myScatterplot",
    x,
    width = NULL,
    height = NULL
  )
}
