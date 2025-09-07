import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a placeholder image service
    // In production, you would integrate with AI image generation APIs like:
    // - OpenAI DALL-E
    // - Stability AI
    // - Midjourney API
    // - Replicate API

    // Mock AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a unique image URL based on prompt
    const imageSeed = prompt.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10)
    const imageUrl = `https://picsum.photos/400/400?random=${imageSeed}`

    // Generate metadata
    const metadata = {
      name: generateNameFromPrompt(prompt),
      description: generateDescriptionFromPrompt(prompt),
      prompt: prompt,
      attributes: generateAttributesFromPrompt(prompt),
      image: imageUrl,
      external_url: '',
      background_color: generateColorFromPrompt(prompt)
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      metadata,
      message: 'NFT generated successfully!'
    })

  } catch (error) {
    console.error('Error generating NFT:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate NFT' },
      { status: 500 }
    )
  }
}

function generateNameFromPrompt(prompt: string): string {
  const words = prompt.split(' ').filter(word => word.length > 3)
  const randomWord = words[Math.floor(Math.random() * words.length)] || 'Artwork'
  const suffixes = ['Dream', 'Vision', 'Creation', 'Masterpiece', 'Art', 'Design']
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  
  return `${randomWord.charAt(0).toUpperCase() + randomWord.slice(1)} ${suffix}`
}

function generateDescriptionFromPrompt(prompt: string): string {
  return `AI-generated artwork created from the prompt: "${prompt}". This unique digital creation showcases the power of artificial intelligence in artistic expression, minted on the Sonic Network for lightning-fast transactions and minimal fees.`
}

function generateAttributesFromPrompt(prompt: string): Array<{trait_type: string, value: string}> {
  const attributes = []
  
  // Extract style from prompt
  if (prompt.toLowerCase().includes('cyberpunk')) {
    attributes.push({ trait_type: 'Style', value: 'Cyberpunk' })
  } else if (prompt.toLowerCase().includes('fantasy')) {
    attributes.push({ trait_type: 'Style', value: 'Fantasy' })
  } else if (prompt.toLowerCase().includes('abstract')) {
    attributes.push({ trait_type: 'Style', value: 'Abstract' })
  } else {
    attributes.push({ trait_type: 'Style', value: 'Digital Art' })
  }

  // Extract colors
  if (prompt.toLowerCase().includes('blue')) {
    attributes.push({ trait_type: 'Primary Color', value: 'Blue' })
  } else if (prompt.toLowerCase().includes('red')) {
    attributes.push({ trait_type: 'Primary Color', value: 'Red' })
  } else if (prompt.toLowerCase().includes('green')) {
    attributes.push({ trait_type: 'Primary Color', value: 'Green' })
  } else {
    attributes.push({ trait_type: 'Primary Color', value: 'Mixed' })
  }

  // Add rarity
  const rarity = Math.random() > 0.8 ? 'Legendary' : Math.random() > 0.5 ? 'Rare' : 'Common'
  attributes.push({ trait_type: 'Rarity', value: rarity })

  // Add generation method
  attributes.push({ trait_type: 'Generation', value: 'AI Generated' })
  attributes.push({ trait_type: 'Network', value: 'Sonic' })

  return attributes
}

function generateColorFromPrompt(prompt: string): string {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']
  return colors[Math.floor(Math.random() * colors.length)]
}
