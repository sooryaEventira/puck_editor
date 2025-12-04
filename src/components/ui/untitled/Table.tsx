import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

const tableCardVariants = cva(
  'flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm',
  {
    variants: {
      size: {
        md: 'text-sm',
        sm: 'rounded-xl text-sm'
      }
    },
    defaultVariants: {
      size: 'md'
    }
  }
)

export interface TableCardRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tableCardVariants> {}

const TableCardRoot = React.forwardRef<HTMLDivElement, TableCardRootProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(tableCardVariants({ size }), className)}
      {...props}
    />
  )
)

TableCardRoot.displayName = 'TableCardRoot'

export interface TableCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableCardHeader = React.forwardRef<HTMLDivElement, TableCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(
        'flex flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between',
        className
      )}
      {...props}
    />
  )
)

TableCardHeader.displayName = 'TableCardHeader'

export interface TableCardHeadingProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableCardHeading = React.forwardRef<HTMLDivElement, TableCardHeadingProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={twMerge('flex flex-col gap-1', className)} {...props} />
  )
)

TableCardHeading.displayName = 'TableCardHeading'

export interface TableCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

const TableCardTitle = React.forwardRef<HTMLHeadingElement, TableCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={twMerge('text-base font-semibold text-slate-900', className)}
      {...props}
    />
  )
)

TableCardTitle.displayName = 'TableCardTitle'

export interface TableCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const TableCardDescription = React.forwardRef<
  HTMLParagraphElement,
  TableCardDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge('text-sm text-slate-500', className)}
    {...props}
  />
))

TableCardDescription.displayName = 'TableCardDescription'

export interface TableCardActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableCardActions = React.forwardRef<HTMLDivElement, TableCardActionsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge('flex items-center gap-3', className)}
      {...props}
    />
  )
)

TableCardActions.displayName = 'TableCardActions'

export interface TableCardBodyProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableCardBody = React.forwardRef<HTMLDivElement, TableCardBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge('overflow-x-auto', className)}
      {...props}
    />
  )
)

TableCardBody.displayName = 'TableCardBody'

export interface TableCardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const TableCardFooter = React.forwardRef<HTMLDivElement, TableCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(
        'border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm text-slate-500',
        className
      )}
      {...props}
    />
  )
)

TableCardFooter.displayName = 'TableCardFooter'

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <table
      ref={ref}
      className={twMerge(
        'min-w-full border-collapse text-left text-sm text-slate-700',
        className
      )}
      {...props}
    />
  )
)

Table.displayName = 'Table'

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={twMerge('bg-slate-50 text-primary', className)}
      {...props}
    />
  )
)

TableHeader.displayName = 'TableHeader'

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={twMerge('divide-y divide-slate-200 bg-white', className)}
      {...props}
    />
  )
)

TableBody.displayName = 'TableBody'

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={twMerge('bg-slate-50 font-medium text-slate-700', className)}
      {...props}
    />
  )
)

TableFooter.displayName = 'TableFooter'

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={twMerge(
        'transition-colors hover:bg-slate-50 focus-within:bg-slate-50 last:border-b-0',
        className
      )}
      {...props}
    />
  )
)

TableRow.displayName = 'TableRow'

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {}

const TableHead = React.forwardRef<HTMLTableHeaderCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={twMerge(
        'px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
        className
      )}
      {...props}
    />
  )
)

TableHead.displayName = 'TableHead'

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={twMerge('px-6 py-4 align-middle text-slate-700', className)}
      {...props}
    />
  )
)

TableCell.displayName = 'TableCell'

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={twMerge('mt-2 text-sm text-slate-500', className)}
      {...props}
    />
  )
)

TableCaption.displayName = 'TableCaption'

export {
  Table as default,
  TableCardRoot,
  TableCardHeader,
  TableCardHeading,
  TableCardTitle,
  TableCardDescription,
  TableCardActions,
  TableCardBody,
  TableCardFooter,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
}

