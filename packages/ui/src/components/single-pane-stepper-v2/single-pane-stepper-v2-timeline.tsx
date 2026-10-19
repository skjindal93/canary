import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'

import { IconV2 } from '@components/icon-v2'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { CardContextProvider, deriveFullPredictedPath, useEngineContext, type CardStatus } from '../flow-stepper/engine'
import { useSinglePaneStepperV2Layout } from './single-pane-stepper-v2-layout-context'

function statusToStepState(status: CardStatus) {
  if (status === 'completed') return 'completed'
  if (status === 'error') return 'error'
  if (status === 'skipped') return 'skipped'
  return 'active'
}

export function SinglePaneStepperV2Timeline({ children }: { children?: ReactNode }) {
  const { flow, cardHistory, activeStepId, registerScrollToCard, requestReactivation, disableAutoScroll } =
    useEngineContext()
  const { showInactiveSteps } = useSinglePaneStepperV2Layout()
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(activeStepId)
  activeRef.current = activeStepId

  const predictedPath = useMemo(
    () => deriveFullPredictedPath(flow, cardHistory, activeStepId).path,
    [flow, cardHistory, activeStepId]
  )

  const scrollToCard = useCallback(
    (stepId: string) => {
      if (disableAutoScroll) return
      const container = containerRef.current
      if (!container) return
      const cardEl = container.querySelector(`[data-card-id="${stepId}"]`) as HTMLElement | null
      if (!cardEl) return

      const containerRect = container.getBoundingClientRect()
      const cardRect = cardEl.getBoundingClientRect()
      // The header scrolls with the steps. Don't jump it off screen when the active
      // card is already visible.
      if (cardRect.top >= containerRect.top && cardRect.bottom <= containerRect.bottom) return
      const offset = cardRect.top - containerRect.top + container.scrollTop

      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ top: Math.max(0, offset - 16), behavior: 'smooth' })
      } else {
        container.scrollTop = Math.max(0, offset - 16)
      }
    },
    [disableAutoScroll]
  )

  useEffect(() => {
    registerScrollToCard(scrollToCard)
  }, [registerScrollToCard, scrollToCard])

  useEffect(() => {
    if (activeRef.current) {
      const timeoutId = setTimeout(() => scrollToCard(activeRef.current), 50)
      return () => clearTimeout(timeoutId)
    }
  }, [scrollToCard])

  return (
    <div ref={containerRef} className="cn-single-pane-stepper-v2-card-stack">
      {children}
      <ol className="cn-single-pane-stepper-v2-list cn-stepper-list" aria-label="Progress steps">
        {cardHistory.map((entry, index) => {
          const config = flow.steps[entry.stepId]
          if (!config) return null
          const CardComponent = config.component
          const derivedState = statusToStepState(entry.status)
          const isLastHistory = index === cardHistory.length - 1
          const fadeActiveConnector = !showInactiveSteps && isLastHistory && entry.status === 'active'
          const isLastVisible = isLastHistory && predictedPath.length === 0 && !fadeActiveConnector

          return (
            <li
              key={entry.stepId}
              data-card-id={entry.stepId}
              className="cn-stepper-step-item cn-single-pane-stepper-v2-step-item"
            >
              <div
                className={cn('cn-stepper-step', `cn-stepper-step-${derivedState}`)}
                aria-current={entry.status === 'active' ? 'step' : undefined}
              >
                <button
                  type="button"
                  className="cn-single-pane-stepper-v2-indicator-btn"
                  aria-label={
                    entry.status === 'completed' || entry.status === 'skipped'
                      ? `Go back to ${config.title || entry.stepId}`
                      : `Step ${index + 1}: ${config.title || entry.stepId}`
                  }
                  disabled={entry.status === 'active' || entry.status === 'error'}
                  onClick={() => {
                    if (entry.status === 'completed' || entry.status === 'skipped') {
                      requestReactivation(entry.stepId)
                    }
                  }}
                >
                  <span className="cn-stepper-indicator">
                    {derivedState === 'completed' || derivedState === 'skipped' ? (
                      <IconV2 name="check" size="xs" />
                    ) : derivedState === 'error' ? (
                      <IconV2 name="xmark-circle" size="xs" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                </button>
              </div>

              {!isLastVisible && (
                <span
                  className={cn('cn-stepper-connector', `cn-stepper-connector-${derivedState}`, {
                    'cn-single-pane-stepper-v2-connector-fade': fadeActiveConnector
                  })}
                  aria-hidden="true"
                />
              )}

              <CardContextProvider stepId={entry.stepId} status={entry.status}>
                <CardComponent />
              </CardContextProvider>
            </li>
          )
        })}

        {showInactiveSteps &&
          predictedPath.map((stepId, index) => {
            const config = flow.steps[stepId]
            if (!config) return null
            const stepNumber = cardHistory.length + index + 1
            const isLast = index === predictedPath.length - 1

            return (
              <li key={stepId} className="cn-stepper-step-item cn-single-pane-stepper-v2-step-item">
                <div className="cn-stepper-step cn-stepper-step-upcoming">
                  <span className="cn-single-pane-stepper-v2-indicator-btn" aria-hidden="true">
                    <span className="cn-stepper-indicator">
                      <span>{stepNumber}</span>
                    </span>
                  </span>
                </div>
                {!isLast && <span className="cn-stepper-connector cn-stepper-connector-upcoming" aria-hidden="true" />}
                <div className="cn-single-pane-stepper-v2-card-upcoming cn-single-pane-stepper-v2-card">
                  <Text
                    as="h3"
                    variant="body-strong"
                    color="foreground-3"
                    className="cn-single-pane-stepper-v2-card-title"
                  >
                    {config.title}
                  </Text>
                </div>
              </li>
            )
          })}
      </ol>
    </div>
  )
}
