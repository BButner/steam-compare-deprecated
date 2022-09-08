import clsx from "clsx"

import styles from "./LoadingBarComponent.module.scss"

interface LoadingBarComponentProps {
	className?: string
}

export const LoadingBarComponent: React.FC<LoadingBarComponentProps> = ({
	className,
}) => {
	return (
		<div
			className={clsx(
				"relative h-6 overflow-hidden rounded bg-gray-300 dark:bg-gray-700",
				className,
			)}
		>
			<div className={styles.loadingBar}></div>
		</div>
	)
}
