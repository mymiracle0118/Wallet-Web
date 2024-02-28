type ComponentProps = {
  className?: string
  children?: React.ReactNode | RouteFactory
}

interface FooterButtonProps extends ComponentProps {
  hover: boolean
}
