#' myScatterplot
#'
#' <Add Description>
#'
#' @param x A vector of x-coordinates
#' @param y A vector of y-coordinates
#' @param z A vector of z-coordinates
#' @param stages Number of stages
#' @param pnum Number of points
#'
#' @return An htmlwidget
#'
#' @import htmlwidgets
#'
#' @export
myScatterplot <- function(x,y,z,stages,pnum) {

  # pass the data
  x <- list(
    X = x,
    Y = y,
    Z = z,
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



#' @export
myScatterplotOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'myScatterplot', width, height, package = 'myScatterplot')
}

#' @export
renderMyScatterplot <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, myScatterplotOutput, env, quoted = TRUE)
}
