export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">{children}</main>;
}
