import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  ItemView,
  WorkspaceLeaf,
} from 'obsidian'
import { View } from './View'
import { createElement } from 'react'
import { Root, createRoot } from 'react-dom/client'

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  mySetting: string
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  mySetting: 'default',
}

export default class MyPlugin extends Plugin {
  settings: MyPluginSettings = DEFAULT_SETTINGS

  async onload() {
    await this.loadSettings()
    this.registerView(FOCUS_TIME_VIEW, (leaf) => new ExampleView(leaf))

    this.addRibbonIcon('watch', 'Focus Time', () => {
      this.activateView()
    })

    const statusBarItemEl = this.addStatusBarItem()
    statusBarItemEl.setText('Status Bar Text')

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this))
  }

  // onunload() { }

  async activateView() {
    const { workspace } = this.app

    let leaf: WorkspaceLeaf | null = null
    const leaves = workspace.getLeavesOfType(FOCUS_TIME_VIEW)

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0]
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false)
      if (leaf === null) {
        throw new Error('Problem setting up view')
      }
      await leaf.setViewState({ type: FOCUS_TIME_VIEW, active: true })
    }
    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf)
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }
}

export const FOCUS_TIME_VIEW = 'focus-time-view'

export class ExampleView extends ItemView {
  root: Root | null = null

  constructor(leaf: WorkspaceLeaf) {
    super(leaf)
  }

  getViewType() {
    return FOCUS_TIME_VIEW
  }

  getDisplayText() {
    return 'Focus Time'
  }

  async onOpen() {
    this.root = createRoot(this.containerEl.children[1])
    this.root.render(createElement(View))
  }

  async onClose() {
    this.root?.unmount()
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this

    containerEl.empty()

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder('Enter your secret')
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value
            await this.plugin.saveSettings()
          }),
      )
  }
}
