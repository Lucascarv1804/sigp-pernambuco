import './globals.css'

export const metadata = {
  title: 'SIGP-PE',
  description: 'Sistema de Gestão de Produtos - Pernambuco',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}