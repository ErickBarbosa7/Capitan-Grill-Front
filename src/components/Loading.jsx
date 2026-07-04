// import Lottie from 'lottie-react'
// import loadingAnim from '../assets/lottie/loading.json'
import styles from './Loading.module.css'

export default function Loading({ size = 80, fullPage = true }) {
  const spinner = (
    <div
      className={styles.spinner}
      style={{ width: size, height: size }}
    >
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  )

  if (!fullPage) return spinner

  return (
    <div className={styles.wrapper}>
      {spinner}
    </div>
  )
}

/* TODO: Reemplazar con Lottie cuando funcione el import
import Lottie from 'lottie-react'
import loadingAnim from '../assets/lottie/loading.json'

const anim = (
  <Lottie
    animationData={loadingAnim}
    loop
    autoplay
    style={{ width: size, height: size }}
  />
)
*/
