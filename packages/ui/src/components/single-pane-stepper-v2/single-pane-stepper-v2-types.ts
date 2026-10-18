import { type ComponentType, type CSSProperties, type ReactNode } from 'react'

import type { DrawerComponentProps, FlowConfig, ReactivationPrompt } from '../flow-stepper/engine'

export interface SinglePaneStepperV2RootProps {
  flow: FlowConfig
  icon?: ReactNode
  title?: string
  stepperTitle?: string
  showStepperHeader?: boolean
  contentTitle?: string
  contentSubtitle?: string
  drawers?: Record<string, ComponentType<DrawerComponentProps>>
  onComplete?: (state: Record<string, unknown>) => void
  onClose?: () => void
  showRootHeader?: boolean
  hideHeader?: boolean
  reactivationPrompt?: ReactivationPrompt
  /** When true, renders a "Step {n}/{total}" label next to each step title. Default true. */
  showStepBadge?: boolean
  /**
   * When true, upcoming steps stay in the timeline. When false, only visited steps render
   * and the active connector fades out. Default true.
   */
  showInactiveSteps?: boolean
  className?: string
  style?: CSSProperties
}

export interface SinglePaneStepperV2CardProps {
  title: string
  description?: string
  /**
   * Text shown as the chat message once this step is completed.
   * Prefer also passing `answer` via `complete({ answer })` so it survives remounts.
   */
  answer?: string
  children: ReactNode
  className?: string
}
