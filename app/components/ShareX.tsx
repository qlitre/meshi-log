type Props = {
  url: string
  title: string
}

export const ShareX = ({ url, title }: Props) => {
  const text = `${title}\n${url}\n#meshilog`
  const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  return (
    <a
      class="inline-flex items-center justify-center gap-2 text-sm rounded-md text-white bg-black/90 px-4 h-10 transition-colors hover:bg-black/70"
      href={twitterLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img class="w-5 h-5" src="/images/xlogo.svg" alt="X (Twitter)" />
      Share
    </a>
  )
}
