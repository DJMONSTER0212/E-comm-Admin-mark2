import * as React from "react"

import { cn } from "@/app/_lib/utils"
import { cva } from "class-variance-authority"

const cardTitleVariants = cva(
  "leading-none tracking-tight",
  {
    variants: {
      size: {
        default: "text-2xl font-semibold",
        sm: "text-sm font-medium",
        base: "text-base font-medium",
        lg: "text-lg font-medium",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardIcon = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("border bg-background p-1.5 rounded-md mb-2 w-10 h-10 flex justify-center items-center", className)}
    {...props} />
))
CardIcon.displayName = "CardIcon"

const CardTitle = React.forwardRef(({ size, className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(cardTitleVariants({ size, className }))}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardIcon, CardDescription, CardContent }
