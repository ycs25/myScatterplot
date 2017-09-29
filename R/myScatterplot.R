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

#' Shiny bindings for myScatterplot
#'
#' Output and render functions for using myScatterplot within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'   \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'   string and have \code{'px'} appended.
#' @param expr An expression that generates a myScatterplot
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'   is useful if you want to save an expression in a variable.
#'
#' @name myScatterplot-shiny
#'
#' @export
myScatterplotOutput <- function(outputId, width = '100%', height = '400px'){
  shinyWidgetOutput(outputId, 'myScatterplot', width, height, package = 'myScatterplot')
}

#' @rdname myScatterplot-shiny
#' @export
renderMyScatterplot <- function(expr, env = parent.frame(), quoted = FALSE) {
  if (!quoted) { expr <- substitute(expr) } # force quoted
  shinyRenderWidget(expr, myScatterplotOutput, env, quoted = TRUE)
}
