import { jsxRenderer } from 'hono/jsx-renderer'
import { Container } from '../../components/Container'
import { LinkToTop } from '../../components/LinkToTop'

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  const { title, description } = frontmatter ?? {}

  const layoutProps = {
    description: description,
    frontmatter: frontmatter,
  }

  return (
    <Layout {...layoutProps}>
      <Container>
        <div class="text-center py-2">
          {title && <h1 class="text-4xl font-bold text-[#222] mb-2">{title}</h1>}
        </div>
        <div class="about-content">{children}</div>
        <LinkToTop />
      </Container>
    </Layout>
  )
})
