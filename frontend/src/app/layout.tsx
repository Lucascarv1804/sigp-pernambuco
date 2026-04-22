import './globals.css'
import { Toaster } from 'react-hot-toast';

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
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  )
}