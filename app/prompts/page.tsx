"use client"

import { useState } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

interface TextBoxNode {
  id: string
  text: string
  children: TextBoxNode[]
}

function TextBox({ node, onAdd, depth = 0 }: { node: TextBoxNode; onAdd: (id: string, count: number) => void; depth?: number }) {
  const [childCount, setChildCount] = useState(1)
  const [text, setText] = useState(node.text)

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex flex-col items-center">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-48 mb-2"
          placeholder="Enter text"
        />
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            min="1"
            max="5"
            value={childCount}
            onChange={(e) => setChildCount(parseInt(e.target.value))}
            className="w-16"
          />
          <Button onClick={() => onAdd(node.id, childCount)}>Add</Button>
        </div>
      </div>
      {node.children.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="flex space-x-4">
            {node.children.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <TextBox node={child} onAdd={onAdd} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TextBoxTree() {
  const [root, setRoot] = useState<TextBoxNode>({
    id: "root",
    text: "",
    children: [],
  })

  const addChildren = (parentId: string, count: number) => {
    const newRoot = { ...root }
    const addChildrenRecursive = (node: TextBoxNode) => {
      if (node.id === parentId) {
        const newChildren = Array.from({ length: count }, (_, index) => ({
          id: `${parentId}-${node.children.length + index}`,
          text: "",
          children: [],
        }))
        node.children = [...node.children, ...newChildren]
        return true
      }
      return node.children.some(addChildrenRecursive)
    }
    addChildrenRecursive(newRoot)
    setRoot(newRoot)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md overflow-x-auto max-w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Text Box Tree</h1>
        <TextBox node={root} onAdd={addChildren} />
      </div>
    </div>
  )
}