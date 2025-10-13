import { jsxRenderer } from "hono/jsx-renderer";

export default jsxRenderer(({ children, Layout, frontmatter }) => {
  const { title, description } = frontmatter ?? {};

  const layoutProps = {
    description: description,
    frontmatter: frontmatter
  };

  return (
    <Layout {...layoutProps}>
      <div class="about-page">
        <header class="page-header">
          {title && <h1>{title}</h1>}
        </header>
        <div class="about-content">
          {children}
        </div>
        <div class="back-to-top">
          <a href="/">← トップページに戻る</a>
        </div>
      </div>
    </Layout>
  );
});