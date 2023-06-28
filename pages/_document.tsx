import Document, {
	DocumentContext,
	DocumentInitialProps,
	Head,
	Html,
	Main,
	NextScript,
} from "next/document"

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const initialProps = await Document.getInitialProps(ctx)

		return initialProps
	}

	render() {
		return (
			<Html>
				<Head>
					<link rel="shortcut icon" href="/logo/0.25x.png" />
					<script
						defer
						data-domain="steamcompare.games"
						src="https://plausible.io/js/script.js"
					></script>
				</Head>
				<body className="prose max-w-full dark:prose-invert">
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
