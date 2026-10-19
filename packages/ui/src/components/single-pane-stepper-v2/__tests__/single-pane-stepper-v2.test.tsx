import React from 'react'

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'

import { useFlowCard, type FlowConfig } from '../../flow-stepper/engine'
import { SinglePaneStepperV2 } from '../index'

vi.mock('@components/icon-v2', () => ({
  IconV2: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
  IconV2DisplayName: 'IconV2',
  IconNameMapV2: {}
}))

vi.mock('@components/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  withTooltip: (Component: React.ComponentType<any>) => Component
}))

vi.mock('@components/copy-button', () => ({
  CopyButton: ({ name }: { name: string }) => <button type="button">Copy {name}</button>
}))

function FlagGoalCard() {
  const { complete } = useFlowCard()
  return (
    <SinglePaneStepperV2.Card
      title="What do you want your first flag to do?"
      description="In a sentence or two, describe what functionality you want your first feature flag to control."
    >
      <button
        onClick={() =>
          complete({
            answer: 'Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
          })
        }
      >
        Continue
      </button>
    </SinglePaneStepperV2.Card>
  )
}

function TargetingCard() {
  const { state, complete } = useFlowCard()
  return (
    <SinglePaneStepperV2.Card title="Who should see the new experience?">
      <span>Previous: {state.answer as string}</span>
      <button onClick={() => complete({ audience: 'subset', answer: 'A subset of users' })}>Finish</button>
    </SinglePaneStepperV2.Card>
  )
}

function ReviewCard() {
  return (
    <SinglePaneStepperV2.Card title="Review and create">
      <span>All done</span>
    </SinglePaneStepperV2.Card>
  )
}

const testFlow: FlowConfig = {
  steps: {
    goal: {
      title: 'What do you want your first flag to do?',
      description: 'Describe the flag',
      component: FlagGoalCard,
      next: 'targeting'
    },
    targeting: {
      title: 'Who should see the new experience?',
      description: 'Choose audience',
      component: TargetingCard,
      next: 'review'
    },
    review: {
      title: 'Review and create',
      description: 'Confirm',
      component: ReviewCard
    }
  },
  initialStep: 'goal'
}

describe('SinglePaneStepperV2', () => {
  test('renders the active question and step badge', () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} title="Create a feature flag" />)

    expect(screen.getByText('What do you want your first flag to do?')).toBeInTheDocument()
    expect(
      screen.getByText('In a sentence or two, describe what functionality you want your first feature flag to control.')
    ).toBeInTheDocument()
    expect(screen.getByText('Step 1/3')).toBeInTheDocument()
    expect(screen.getByText('Create a feature flag')).toBeInTheDocument()
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  test('replaces the completed form with a chat message instead of an accordion', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)

    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(
        screen.getByText('Switch a Sign Up button from blue to green, or change its copy, for a subset of users.')
      ).toBeInTheDocument()
    })

    expect(screen.queryByText('Continue')).not.toBeInTheDocument()
    expect(screen.getByText('What do you want your first flag to do?')).toBeInTheDocument()
    expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit this answer' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: 'Copy Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
      })
    ).toBeInTheDocument()
  })

  test('does not render the form when a completed step has no answer', async () => {
    function SilentCard() {
      const { complete } = useFlowCard()
      return (
        <SinglePaneStepperV2.Card title="Name the flag">
          <button onClick={() => complete({ flagName: 'signup-color' })}>Save</button>
        </SinglePaneStepperV2.Card>
      )
    }

    const flow: FlowConfig = {
      steps: {
        name: {
          title: 'Name the flag',
          component: SilentCard
        }
      },
      initialStep: 'name'
    }

    render(<SinglePaneStepperV2.Root flow={flow} />)
    await userEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(screen.queryByText('Save')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Name the flag')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit this answer' })).not.toBeInTheDocument()
  })

  test('does not render accordion collapse controls on completed steps', async () => {
    const { container } = render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
    })

    expect(container.querySelector('[data-state]')).not.toBeInTheDocument()
    expect(container.querySelector('.cn-accordion')).toBeNull()
  })

  test('passes accumulated state to the next card', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(
        screen.getByText(
          'Previous: Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
        )
      ).toBeInTheDocument()
    })
  })

  test('can go back from a completed chat message and restore the form', async () => {
    render(<SinglePaneStepperV2.Root flow={testFlow} />)
    await userEvent.click(screen.getByText('Continue'))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Edit this answer' })).toBeInTheDocument()
    })

    await userEvent.click(screen.getByRole('button', { name: 'Edit this answer' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => {
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })
    expect(
      screen.queryByText('Switch a Sign Up button from blue to green, or change its copy, for a subset of users.')
    ).not.toBeInTheDocument()
  })

  test('hides upcoming steps and fades the active connector when showInactiveSteps is false', () => {
    const { container } = render(<SinglePaneStepperV2.Root flow={testFlow} showInactiveSteps={false} />)

    expect(screen.queryByText('Who should see the new experience?')).not.toBeInTheDocument()
    expect(screen.queryByText('Review and create')).not.toBeInTheDocument()
    expect(container.querySelector('.cn-single-pane-stepper-v2-card-upcoming')).toBeNull()
    expect(container.querySelector('.cn-single-pane-stepper-v2-connector-fade')).toBeInTheDocument()
  })

  test('badge total follows this run, not every configured step', () => {
    function StartCard() {
      return (
        <SinglePaneStepperV2.Card title="Start">
          <span>Start form</span>
        </SinglePaneStepperV2.Card>
      )
    }
    function PathCard() {
      return <SinglePaneStepperV2.Card title="On the path">Path</SinglePaneStepperV2.Card>
    }
    function OtherCard() {
      return <SinglePaneStepperV2.Card title="Other branch">Other</SinglePaneStepperV2.Card>
    }

    const flow: FlowConfig = {
      steps: {
        start: { title: 'Start', component: StartCard, next: 'path' },
        path: { title: 'On the path', component: PathCard },
        other: { title: 'Other branch', component: OtherCard }
      },
      initialStep: 'start'
    }

    render(<SinglePaneStepperV2.Root flow={flow} />)
    expect(screen.getByText('Step 1/2')).toBeInTheDocument()
    expect(screen.queryByText('Other branch')).not.toBeInTheDocument()
  })

  test('resumes from initialEngineState', () => {
    render(
      <SinglePaneStepperV2.Root
        flow={testFlow}
        initialEngineState={{
          state: { answer: 'restored' },
          cardHistory: [
            {
              stepId: 'goal',
              status: 'completed',
              stateSnapshot: {
                answer: 'Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
              },
              answer: 'Switch a Sign Up button from blue to green, or change its copy, for a subset of users.'
            },
            { stepId: 'targeting', status: 'active', stateSnapshot: {} }
          ]
        }}
      />
    )
    expect(screen.getByText('Who should see the new experience?')).toBeInTheDocument()
    expect(screen.queryByText('Continue')).not.toBeInTheDocument()
  })

  test('calls onClose from the root header', async () => {
    const onClose = vi.fn()
    render(<SinglePaneStepperV2.Root flow={testFlow} title="Create a feature flag" onClose={onClose} />)
    await userEvent.click(screen.getByLabelText('Close'))
    expect(onClose).toHaveBeenCalled()
  })
})
