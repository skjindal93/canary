import { ReactNode } from 'react'

import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { useCardStatus, useEngineContext, type CardStatus } from '../flow-stepper/engine'
import { SinglePaneStepperV2Answer } from './single-pane-stepper-v2-answer'
import { useSinglePaneStepperV2Layout } from './single-pane-stepper-v2-layout-context'
import { SinglePaneStepperV2CardProps } from './single-pane-stepper-v2-types'

const INTERACTIVE_STATES: Set<CardStatus> = new Set(['active', 'error'])
const TERMINAL_STATES: Set<CardStatus> = new Set(['completed', 'skipped'])

function resolveAnswer(
  answerProp: string | undefined,
  historyAnswer: string | undefined,
  stateSnapshot: Record<string, unknown> | undefined
) {
  if (typeof answerProp === 'string' && answerProp.length > 0) return answerProp
  if (typeof historyAnswer === 'string' && historyAnswer.length > 0) return historyAnswer
  const snapshotAnswer = stateSnapshot?.answer
  if (typeof snapshotAnswer === 'string' && snapshotAnswer.length > 0) return snapshotAnswer
  return undefined
}

export function SinglePaneStepperV2Card({
  title,
  description,
  answer,
  children,
  className
}: SinglePaneStepperV2CardProps) {
  const { cardHistory } = useEngineContext()
  const { stepId, status } = useCardStatus()
  const { showStepBadge, totalSteps } = useSinglePaneStepperV2Layout()

  const entry = cardHistory.find(item => item.stepId === stepId)
  const stepNumber = cardHistory.findIndex(item => item.stepId === stepId) + 1
  const isTerminal = TERMINAL_STATES.has(status)
  const isLastCard = cardHistory[cardHistory.length - 1]?.stepId === stepId
  const isFlowComplete = !cardHistory.some(item => INTERACTIVE_STATES.has(item.status))
  const isFinished = isTerminal && isLastCard && isFlowComplete
  const showRestart = isTerminal && !isFinished
  const resolvedAnswer = resolveAnswer(answer, entry?.answer, entry?.stateSnapshot)

  return (
    <div
      className={cn(
        'cn-single-pane-stepper-v2-card',
        {
          'cn-single-pane-stepper-v2-card-active': status === 'active',
          'cn-single-pane-stepper-v2-card-completed': status === 'completed',
          'cn-single-pane-stepper-v2-card-error': status === 'error',
          'cn-single-pane-stepper-v2-card-skipped': status === 'skipped'
        },
        className
      )}
    >
      <div className="cn-single-pane-stepper-v2-card-copy">
        <div className="cn-single-pane-stepper-v2-card-title-row">
          <Text as="h3" variant="body-strong" color="foreground-1" className="cn-single-pane-stepper-v2-card-title">
            {title}
          </Text>
          {showStepBadge && stepNumber > 0 && totalSteps > 0 ? (
            <span className="cn-single-pane-stepper-v2-step-badge">
              Step {stepNumber}/{totalSteps}
            </span>
          ) : null}
        </div>
        {description ? (
          <Text
            as="p"
            variant="body-normal"
            color="foreground-3"
            className="cn-single-pane-stepper-v2-card-description"
          >
            {description}
          </Text>
        ) : null}
      </div>

      {status === 'completed' && resolvedAnswer ? (
        <SinglePaneStepperV2Answer
          stepId={stepId}
          answer={resolvedAnswer}
          completedAt={entry?.completedAt}
          showRestart={showRestart}
        />
      ) : status === 'skipped' ? (
        <Text as="p" variant="body-normal" color="foreground-3">
          Skipped
        </Text>
      ) : (
        <div className="cn-single-pane-stepper-v2-card-content">{children as ReactNode}</div>
      )}
    </div>
  )
}
