// source: https://codesandbox.io/embed/r3f-train-l900i
import { useCallback, useEffect, useMemo } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'
// import { isMobile } from '../Utils/BrowserDetection'

export default function useYScroll(bounds, props) {
  const [{ y }, set] = useSpring(() => ({ y: 0, config: config.slow }))
  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = y.get() }) => {
      const newY = clamp(memo + cy - py, ...bounds)
      set({ y: newY })
      return newY
    },
    [bounds, y, set]
  )
  const gestureProps = useMemo(() => {
    let props = { onWheel: fn, onDrag: fn }
    // if (isMobile) {
    // props = { onMove: fn }
    // }
    return props
  })
  const bind = useGesture(gestureProps, props)
  useEffect(() => props && props.domTarget && bind(), [props, bind])
  return [y, bind]
}
