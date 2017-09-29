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
