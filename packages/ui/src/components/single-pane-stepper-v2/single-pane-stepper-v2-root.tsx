import { useMemo } from 'react'

import { AlertDialog } from '@components/alert-dialog'
import { IconV2 } from '@components/icon-v2'
import { Layout } from '@components/layout'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { FlowEngineProvider, useEngineContext, type FlowConfig } from '../flow-stepper/engine'
import { SinglePaneStepperV2LayoutProvider } from './single-pane-stepper-v2-layout-context'
import { SinglePaneStepperV2Timeline } from './single-pane-stepper-v2-timeline'
import { SinglePaneStepperV2RootProps } from './single-pane-stepper-v2-types'

const DEFAULT_REACTIVATION_PROMPT = {
  title: 'Go back?',
  description: 'Going back to this step will discard your progress on subsequent steps. Are you sure?'
}

function countFlowSteps(steps: FlowConfig['steps'], initialStep: string) {
  const seen = new Set<string>()
  let current: string | undefined = initialStep
  while (current && steps[current] && !seen.has(current)) {
    seen.add(current)
    current = steps[current].next
  }
  return Math.max(seen.size, Object.keys(steps).length)
}

function SinglePaneStepperV2Content({
  title,
  icon,
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle,
  drawers,
  onClose,
  showRootHeader,
  hideHeader,
  reactivationPrompt,
  showStepBadge = true,
  showInactiveSteps = true,
  className,
  style
}: Omit<SinglePaneStepperV2RootProps, 'flow' | 'onComplete'>) {
  const { drawerState, closeDrawer, pendingReactivation, confirmReactivation, cancelReactivation, flow } =
    useEngineContext()

  const prompt = reactivationPrompt || DEFAULT_REACTIVATION_PROMPT
  const showHeader = (showRootHeader ?? !hideHeader) !== false && !!(icon || title || onClose)
  const totalSteps = countFlowSteps(flow.steps, flow.initialStep)

  const activeDrawer = useMemo(() => {
    if (!drawerState || !drawers) return null
    const DrawerComponent = drawers[drawerState.id]
    if (!DrawerComponent) return null
    return <DrawerComponent open={true} onClose={closeDrawer} props={drawerState.props} />
  }, [drawerState, drawers, closeDrawer])

  return (
    <>
      <Layout.Vertical gap="none" className={cn('cn-single-pane-stepper-v2-root', className)} style={style}>
        {showHeader && (
          <Layout.Horizontal as="header" align="center" gap="sm" className="cn-single-pane-stepper-v2-header">
            {icon}
            {title && (
              <Text as="h1" variant="heading-section" color="foreground-1" className="!m-0 min-w-0 flex-1">
                {title}
              </Text>
            )}
            {!title && <div className="flex-1" />}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cn-single-pane-stepper-v2-close-btn"
              >
                <IconV2 name="xmark" size="sm" />
              </button>
            )}
          </Layout.Horizontal>
        )}

        <div className="cn-single-pane-stepper-v2-body">
          <SinglePaneStepperV2LayoutProvider
            showStepBadge={showStepBadge}
            totalSteps={totalSteps}
            showInactiveSteps={showInactiveSteps}
          >
            <SinglePaneStepperV2Timeline>
              {(showStepperHeader && stepperTitle) || contentTitle || contentSubtitle ? (
                <Layout.Vertical gap="2xs" className="cn-single-pane-stepper-v2-content-header">
                  {showStepperHeader && stepperTitle && (
                    <Text as="h2" variant="heading-subsection" color="foreground-1" className="!m-0">
                      {stepperTitle}
                    </Text>
                  )}
                  {contentTitle && (
                    <Text as="h2" variant="heading-subsection" color="foreground-1" className="!m-0">
                      {contentTitle}
                    </Text>
                  )}
                  {contentSubtitle && (
                    <Text as="p" variant="body-normal" color="foreground-2" className="!m-0">
                      {contentSubtitle}
                    </Text>
                  )}
                </Layout.Vertical>
              ) : null}
            </SinglePaneStepperV2Timeline>
          </SinglePaneStepperV2LayoutProvider>
        </div>
      </Layout.Vertical>

      {activeDrawer}

      <AlertDialog.Root
        open={!!pendingReactivation}
        onOpenChange={open => {
          if (!open) cancelReactivation()
        }}
        onConfirm={confirmReactivation}
        onCancel={cancelReactivation}
        theme="warning"
      >
        <AlertDialog.Content title={prompt.title}>{prompt.description}</AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

export function SinglePaneStepperV2Root({ flow, onComplete, ...props }: SinglePaneStepperV2RootProps) {
  return (
    <FlowEngineProvider flow={flow} onComplete={onComplete}>
      <SinglePaneStepperV2Content {...props} />
    </FlowEngineProvider>
  )
}
