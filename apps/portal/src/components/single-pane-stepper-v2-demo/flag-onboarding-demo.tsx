import { useState } from "react";

import {
  Button,
  ButtonLayout,
  CardSelect,
  Radio,
  SinglePaneStepperV2,
  Textarea,
  TextInput,
  TooltipProvider,
  useFlowCard,
} from "@harnessio/ui/components";
import type { FlowConfig } from "@harnessio/ui/components";

function GoalCard() {
  const { complete } = useFlowCard();
  const [value, setValue] = useState(
    "Switch a Sign Up button from blue to green, or change its copy, for a subset of users.",
  );

  return (
    <SinglePaneStepperV2.Card
      title="What do you want your first flag to do?"
      description="In a sentence or two, describe what functionality you want your first feature flag to control."
    >
      <Textarea
        name="flag-goal"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={4}
      />
      <ButtonLayout.Root>
        <Button
          disabled={!value.trim()}
          onClick={() => complete({ goal: value, answer: value })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function IdentityCard() {
  const { complete } = useFlowCard();
  const [value, setValue] = useState<string>("user-id");
  const labels: Record<string, string> = {
    anonymous: "Anonymous visitors",
    "user-id": "Logged-in users by ID",
  };

  return (
    <SinglePaneStepperV2.Card
      title="How should we identify users?"
      description="Choose the identifier Harness will use when evaluating this flag."
    >
      <CardSelect.Root
        type="single"
        value={value}
        onValueChange={(next: unknown) => setValue(String(next))}
      >
        <CardSelect.Item value="anonymous">Anonymous visitors</CardSelect.Item>
        <CardSelect.Item value="user-id">Logged-in users by ID</CardSelect.Item>
      </CardSelect.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() => complete({ identity: value, answer: labels[value] })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function AudienceCard() {
  const { complete } = useFlowCard();
  const [value, setValue] = useState("subset");
  const labels: Record<string, string> = {
    everyone: "Everyone",
    subset: "A subset of users",
    specific: "Specific targets only",
  };

  return (
    <SinglePaneStepperV2.Card
      title="Who should see the new experience?"
      description="This can be changed later without a deploy."
    >
      <Radio.Root value={value} onValueChange={setValue}>
        <Radio.Item value="everyone" label="Everyone" />
        <Radio.Item value="subset" label="A subset of users" />
        <Radio.Item value="specific" label="Specific targets only" />
      </Radio.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() => complete({ audience: value, answer: labels[value] })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function NameCard() {
  const { complete } = useFlowCard();
  const [value, setValue] = useState("signup-button-color");

  return (
    <SinglePaneStepperV2.Card
      title="What should we name this flag?"
      description="Use a stable identifier. This becomes the flag key in code."
    >
      <TextInput
        name="flag-name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <ButtonLayout.Root>
        <Button
          disabled={!value.trim()}
          onClick={() => complete({ flagName: value, answer: value })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function EnvironmentCard() {
  const { complete } = useFlowCard();
  const [value, setValue] = useState("qa");
  const labels: Record<string, string> = {
    qa: "QA",
    staging: "Staging",
    production: "Production",
  };

  return (
    <SinglePaneStepperV2.Card
      title="Where will this flag live first?"
      description="Start somewhere safe, then promote the same flag key."
    >
      <Radio.Root value={value} onValueChange={setValue}>
        <Radio.Item value="qa" label="QA" />
        <Radio.Item value="staging" label="Staging" />
        <Radio.Item value="production" label="Production" />
      </Radio.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() =>
            complete({ environment: value, answer: labels[value] })
          }
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function RolloutCard() {
  const { complete } = useFlowCard();
  const [value, setValue] = useState("percentage");
  const labels: Record<string, string> = {
    off: "Serve the default variation",
    percentage: "Roll out to 10% of users",
    on: "Serve the new variation to everyone",
  };

  return (
    <SinglePaneStepperV2.Card
      title="How should we roll it out?"
      description="Choose the first serving rule. You can change this after create."
    >
      <CardSelect.Root
        type="single"
        value={value}
        onValueChange={(next: unknown) => setValue(String(next))}
      >
        <CardSelect.Item value="off">
          Serve the default variation
        </CardSelect.Item>
        <CardSelect.Item value="percentage">
          Roll out to 10% of users
        </CardSelect.Item>
        <CardSelect.Item value="on">
          Serve the new variation to everyone
        </CardSelect.Item>
      </CardSelect.Root>
      <ButtonLayout.Root>
        <Button
          onClick={() => complete({ rollout: value, answer: labels[value] })}
        >
          Continue
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

function ReviewCard() {
  const { state, complete } = useFlowCard<{
    flagName?: string;
    environment?: string;
    answer?: string;
  }>();
  const summary = `Create ${state.flagName ?? "this flag"} in ${state.environment ?? "QA"}`;

  return (
    <SinglePaneStepperV2.Card
      title="Ready to create this flag?"
      description="Review the conversation above, then create the flag."
    >
      <ButtonLayout.Root>
        <Button onClick={() => complete({ answer: summary })}>
          Create flag
        </Button>
      </ButtonLayout.Root>
    </SinglePaneStepperV2.Card>
  );
}

const flagOnboardingFlow: FlowConfig = {
  steps: {
    goal: {
      title: "What do you want your first flag to do?",
      component: GoalCard,
      next: "identity",
    },
    identity: {
      title: "How should we identify users?",
      component: IdentityCard,
      next: "audience",
    },
    audience: {
      title: "Who should see the new experience?",
      component: AudienceCard,
      next: "name",
    },
    name: {
      title: "What should we name this flag?",
      component: NameCard,
      next: "environment",
    },
    environment: {
      title: "Where will this flag live first?",
      component: EnvironmentCard,
      next: "rollout",
    },
    rollout: {
      title: "How should we roll it out?",
      component: RolloutCard,
      next: "review",
    },
    review: {
      title: "Ready to create this flag?",
      component: ReviewCard,
    },
  },
  initialStep: "goal",
};

export function FlagOnboardingDemo() {
  const [showInactiveSteps, setShowInactiveSteps] = useState(true);

  return (
    // .not-content opts the timeline out of Starlight prose rules (list markers, li spacing,
    // heading sizes) that otherwise collide with the stepper rail.
    <div className="not-content my-6">
      <Radio.Root
        value={showInactiveSteps ? "show" : "hide"}
        onValueChange={(next) => setShowInactiveSteps(next === "show")}
        className="mb-cn-md grid-flow-col auto-cols-max"
        aria-label="Inactive steps"
      >
        <Radio.Item value="show" label="Show inactive steps" />
        <Radio.Item value="hide" label="Hide inactive steps" />
      </Radio.Root>
      <div className="h-[720px] overflow-hidden rounded-lg border border-cn-2 bg-cn-2">
        <div className="h-full">
          <TooltipProvider>
            <SinglePaneStepperV2.Root
              flow={flagOnboardingFlow}
              contentTitle="Create your first feature flag"
              contentSubtitle="Answer each question. Completed answers stay in the thread as chat messages."
              showRootHeader={false}
              showInactiveSteps={showInactiveSteps}
            />
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
