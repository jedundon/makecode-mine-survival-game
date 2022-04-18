namespace SpriteKind {
    export const Icon = SpriteKind.create()
    export const UI = SpriteKind.create()
    export const Tool = SpriteKind.create()
}
function groundLevelAtColumn (col: number) {
    return world_ground_height[col]
}
function generateWorldBiomePlains (biome_location: any[]) {
    temp_biome = biome_location[0]
    temp_biome_x = biome_location[1]
    temp_biome_y = biome_location[2]
    temp_biome_width = biome_location[3]
    temp_biome_height = biome_location[4]
    for (let col2 = 0; col2 <= temp_biome_width; col2++) {
        for (let row = 0; row <= temp_biome_height; row++) {
            temp_x = temp_biome_x + col2
            temp_y = temp_biome_y + row
            if (temp_y == world_ground_height[temp_x]) {
                tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`Grass`)
                tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
            } else if (temp_y > world_ground_height[temp_x]) {
                if (Math.percentChance(75)) {
                    tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`stone`)
                    tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
                } else {
                    tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`Dirt`)
                    tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
                }
            }
        }
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (toolCurrentLabel() == "hammer" && controller.A.isPressed()) {
        if (tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.row) - grid.spriteRow(selected_block) < 3) {
            grid.move(selected_block, 0, -1)
        }
    }
})
function itemsLabelForId (id: number) {
    return items_all[id]
}
sprites.onOverlap(SpriteKind.Tool, SpriteKind.Enemy, function (sprite, otherSprite) {
    if (controller.A.isPressed()) {
        otherSprite.destroy(effects.disintegrate, 500)
        char_xp_current += 5
        uiUpdateStatBars()
    }
})
function inventoryGetItemLabelByTileImage (image2: Image) {
    if (items_tile_images.indexOf(image2) > 0) {
        return itemsLabelForId(items_tile_images.indexOf(image2))
    } else if (items_tile_images_alt.indexOf(image2) > 0) {
        return itemsLabelForId(items_tile_images_alt.indexOf(image2))
    } else {
        return ""
    }
}
function generateWorldBiomeLocations () {
    world_biome_types = [
    "plains",
    "snow",
    "desert",
    "middle",
    "bottom"
    ]
    world_biome_locations = []
    world_biome_cols_lookup = []
    world_biome_cols_min = 20
    world_biome_cols_max = 40
    world_col_index = 0
    while (world_col_index < world_cols) {
        world_biome_width = Math.constrain(randint(world_biome_cols_min, world_biome_cols_max), 0, world_cols - world_col_index)
        temp_biome = getRandomWorldBiome()
        world_biome_locations.push(generateWorldBiomeLocationArray(temp_biome, world_col_index, 0, world_biome_width, Math.floor(world_rows / 2)))
        for (let index = 0; index < world_biome_width; index++) {
            world_biome_cols_lookup.push(temp_biome)
        }
        world_col_index += world_biome_width
    }
    world_biome_locations.push(generateWorldBiomeLocationArray("middle", 0, Math.floor(world_rows / 2) + 1, world_cols, Math.floor(world_rows * 0.25)))
    world_biome_locations.push(generateWorldBiomeLocationArray("bottom", 0, Math.floor(world_rows * 0.75) + 1, world_cols, Math.floor(world_rows * 0.25)))
    for (let value of world_biome_locations) {
        console.log(value)
    }
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    toolChangeNext()
})
function generateWorldBiomeDesert (biome_location: any[]) {
    temp_biome = biome_location[0]
    temp_biome_x = biome_location[1]
    temp_biome_y = biome_location[2]
    temp_biome_width = biome_location[3]
    temp_biome_height = biome_location[4]
    for (let col2 = 0; col2 <= temp_biome_width; col2++) {
        for (let row = 0; row <= temp_biome_height; row++) {
            temp_x = temp_biome_x + col2
            temp_y = temp_biome_y + row
            if (temp_y == world_ground_height[temp_x]) {
                tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`Sand`)
                tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
            } else if (temp_y > world_ground_height[temp_x]) {
                if (Math.percentChance(75)) {
                    tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`stone`)
                    tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
                } else {
                    tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`Sand`)
                    tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
                }
            }
        }
    }
}
function toolChangeNext () {
    // Picks the next item ID in the list. Goes back to 0 if bigger than list.
    tool_selected = (tool_selected + 1) % tools_inventory.length
    tool_selected_icon.setImage(toolCurrentIcon())
    char_tool_sprite.setImage(toolCurrentImage())
    uiAddMessageToQueue(toolCurrentLabel())
}
function generateGroundHeight () {
    world_ground_height = []
    ground_prev = 15
    ground_min = 8
    ground_max = 25
    for (let col = 0; col <= world_cols - 1; col++) {
        if (Math.percentChance(15)) {
            ground_current = Math.constrain(ground_prev - 1, ground_min, ground_max)
        } else if (Math.percentChance(15)) {
            ground_current = Math.constrain(ground_prev + 1, ground_min, ground_max)
        } else if (Math.percentChance(5)) {
            ground_current = Math.constrain(ground_prev - randint(2, 5), ground_min, ground_max)
        } else if (Math.percentChance(5)) {
            ground_current = Math.constrain(ground_prev + randint(2, 5), ground_min, ground_max)
        } else {
            ground_current = ground_prev
        }
        ground_prev = ground_current
        world_ground_height.push(ground_current)
    }
}
function buildValid () {
    if (char.overlapsWith(selected_block)) {
        return 0
    } else if (tiles.tileIsWall(tiles.locationOfSprite(selected_block))) {
        return 0
    } else {
        return 1
    }
}
// Game Systems
// 
// -----------
// 
// crafting
// 
// inventory
// 
// monsters
// 
// day/night cycle
// 
// equipment
// 
// - pickaxe
// 
// - axe
// 
// - hammer
// 
// - sword
// 
// multiplayer
// 
// bosses?
// 
// build
// 
// mining/getting resources
// 
// fun
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (toolCurrentLabel() == "pickaxe") {
        if (!(char_button_direction < 0)) {
            if (tiles.tileIsWall(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction))) {
                if (!(tiles.tileIs(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`CORE`))) {
                    inventoryAddItemByTileImage(tiles.tileImageAtLocation(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction)))
                    if (isActionLocationAboveGround(char, char_button_direction)) {
                        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`Stone_Background`)
                    } else {
                        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), assets.tile`Sky_Block`)
                    }
                    tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(char), char_button_direction), false)
                }
            }
        }
    } else if (toolCurrentLabel() == "hammer") {
        selected_block = sprites.create(buildables_tile_images[2], SpriteKind.Food)
        sprites.setDataImage(selected_block, "img", selected_block.image)
sprites.setDataString(selected_block, "label", "brick")
        sprites.setDataNumber(selected_block, "id", 2)
        sprites.setDataNumber(selected_block, "blink", 0)
        sprites.setDataNumber(selected_block, "blink_at", 15)
        sprites.setDataNumber(selected_block, "blink_max", 30)
        selected_block.z = -1
        grid.place(selected_block, tiles.locationInDirection(tiles.locationInDirection(tiles.locationOfSprite(char), CollisionDirection.Bottom), CollisionDirection.Bottom))
    }
})
function buildablesIdForLabel (label: string) {
    return buildables_all.indexOf(label)
}
function generateWorldBiomeLocationArray (biome: string, x: number, y: number, w: number, h: number) {
    return [
    world_biome_types.indexOf(biome),
    x,
    y,
    w,
    h
    ]
}
function setupVariables () {
    tick_speed = 1000
    char_speed_max = 125
    char_speed_rate = 10
    char_speed_decel_rate = 0.85
    char_speed_jump = -150
    ui_message_queue = []
    entities_max = 10
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (toolCurrentLabel() == "hammer" && controller.A.isPressed()) {
        if (tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.column) - grid.spriteCol(selected_block) < 4) {
            grid.move(selected_block, -1, 0)
        }
    }
})
function setupUIMessages () {
    ui_message = textsprite.create("", 1, 15)
    ui_message.setMaxFontHeight(3)
    ui_message.setFlag(SpriteFlag.RelativeToCamera, true)
}
function generateWorld () {
    tiles.setTilemap(tilemap`World`)
    scene.setBackgroundImage(assets.image`biomePlains`)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer0)
    scroller.setCameraScrollingMultipliers(0.25, 0, scroller.BackgroundLayer.Layer0)
    world_rows = tiles.tilemapRows() - 0
    world_cols = tiles.tilemapColumns() - 0
    generateGroundHeight()
    for (let col2 = 0; col2 <= world_cols - 1; col2++) {
        for (let row = 0; row <= world_rows - 1; row++) {
            if (row == world_rows - 1) {
                tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`CORE`)
                tiles.setWallAt(tiles.getTileLocation(col2, row), true)
            } else if (row > world_ground_height[col2]) {
                if (Math.percentChance(75)) {
                    tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`stone`)
                    tiles.setWallAt(tiles.getTileLocation(col2, row), true)
                } else {
                    tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`Dirt`)
                    tiles.setWallAt(tiles.getTileLocation(col2, row), true)
                }
            } else if (Math.percentChance(100)) {
                if (row == world_ground_height[col2]) {
                    tiles.setTileAt(tiles.getTileLocation(col2, row), assets.tile`Grass`)
                    tiles.setWallAt(tiles.getTileLocation(col2, row), true)
                }
            } else {
            	
            }
        }
    }
    generatePlants()
}
function isActionLocationAboveGround (char: Sprite, button_direction: number) {
    return tiles.locationXY(tiles.locationInDirection(tiles.locationOfSprite(char), button_direction), tiles.XY.row) >= groundLevelAtColumn(tiles.locationXY(tiles.locationInDirection(tiles.locationOfSprite(char), button_direction), tiles.XY.column))
}
function generateWorldBiomeSnow (biome_location: any[]) {
    temp_biome = biome_location[0]
    temp_biome_x = biome_location[1]
    temp_biome_y = biome_location[2]
    temp_biome_width = biome_location[3]
    temp_biome_height = biome_location[4]
    for (let col2 = 0; col2 <= temp_biome_width; col2++) {
        for (let row = 0; row <= temp_biome_height; row++) {
            temp_x = temp_biome_x + col2
            temp_y = temp_biome_y + row
            if (temp_y == world_ground_height[temp_x]) {
                tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`SnowGrass`)
                tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
            } else if (temp_y > world_ground_height[temp_x]) {
                if (Math.percentChance(75)) {
                    tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`stone`)
                    tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
                } else {
                    tiles.setTileAt(tiles.getTileLocation(temp_x, temp_y), assets.tile`Dirt`)
                    tiles.setWallAt(tiles.getTileLocation(temp_x, temp_y), true)
                }
            }
        }
    }
}
function inventoryAddAmountByLabel (item: string, amount: number) {
    items_inventory[itemsIdForLabel(item)] = Math.constrain(inventoryGetAmountByLabel(item) + amount, 0, 9999)
}
function buildablesCanPlayerBuild (label: string) {
    temp_recipe = buildables_recipe_items[buildablesIdForLabel(label)]
    for (let b of temp_recipe) {
        temp_recipe_item = itemsLabelForId(b[0])
        temp_recipe_amount = b[1]
        if (inventoryGetAmountByLabel(temp_recipe_item) < temp_recipe_amount) {
            return false
        } else {
            inventoryAddAmountByLabel(temp_recipe_item, temp_recipe_amount * -1)
        }
    }
    return true
}
function setupBuildableTiles () {
    buildables_all = [
    "dirt",
    "dirt_grass",
    "brick",
    "stone",
    "rock_block"
    ]
    buildables_tile_images = [
    assets.tile`Dirt`,
    assets.tile`Grass`,
    assets.tile`brick_block`,
    assets.tile`stone`,
    assets.tile`Rock_Block`
    ]
    buildables_recipe_items = [
    [[itemsIdForLabel("dirt"), 1]],
    [[itemsIdForLabel("dirt"), 1]],
    [[itemsIdForLabel("dirt"), 1], [itemsIdForLabel("stone"), 1]],
    [[itemsIdForLabel("stone"), 1]],
    [[itemsIdForLabel("stone"), 2]]
    ]
}
function generatePlants () {
    for (let col3 = 0; col3 <= world_cols - 1; col3++) {
        ground_current = world_ground_height[col3]
        if (Math.percentChance(10)) {
            tiles.setTileAt(tiles.getTileLocation(col3, ground_current - 1), assets.tile`BushEmpty`)
        } else if (Math.percentChance(25)) {
            tree_height = randint(2, 5)
            tiles.setTileAt(tiles.getTileLocation(col3, ground_current - 1), assets.tile`TreeTrunk0`)
            for (let index = 0; index <= tree_height - 2; index++) {
                tiles.setTileAt(tiles.getTileLocation(col3, ground_current - (index + 2)), assets.tile`TreeLog0`)
            }
            tiles.setTileAt(tiles.getTileLocation(col3, ground_current - tree_height), assets.tile`TreeTop`)
        }
    }
}
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    if (sprite.isHittingTile(CollisionDirection.Left)) {
        sprites.setDataNumber(sprite, "direction", 1)
    } else if (sprite.isHittingTile(CollisionDirection.Right)) {
        sprites.setDataNumber(sprite, "direction", -1)
    }
    if (debug_mode) {
        sprite.sayText(sprite.vx)
    }
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (toolCurrentLabel() == "hammer" && controller.A.isPressed()) {
        if (grid.spriteCol(selected_block) - tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.column) < 4) {
            grid.move(selected_block, 1, 0)
        }
    }
})
function uiShowMessage (text: string) {
    ui_message.setText(text)
    ui_message.ay = 0
    ui_message.setVelocity(0, 0)
    ui_message.setPosition(scene.screenWidth() / 2, scene.screenHeight() - 10)
    ui_message.ay = 2
}
function getPlayerBiome () {
    return world_biome_cols_lookup[char.tilemapLocation().column]
}
controller.A.onEvent(ControllerButtonEvent.Released, function () {
    if (toolCurrentLabel() == "hammer") {
        if (buildValid() == 1 && buildablesCanPlayerBuild(sprites.readDataString(selected_block, "label"))) {
            tiles.setTileAt(tiles.locationOfSprite(selected_block), sprites.readDataImage(selected_block, "img"))
            tiles.setWallAt(tiles.locationOfSprite(selected_block), true)
            selected_block.destroy()
        } else {
            selected_block.destroy(effects.disintegrate, 100)
        }
    } else {
    	
    }
})
function toolCurrentLabel () {
    return tools_all[tools_inventory[tool_selected]]
}
function setupBuildables () {
    buildable_blocks = []
    buildable_blocks.push(assets.tile`brick_block`)
    buildable_blocks.push(assets.tile`Rock_Block`)
    buildable_blocks.push(assets.tile`Dirt`)
    buildable_blocks.push(assets.tile`stone`)
    buildable_blocks.push(assets.tile`BushEmpty`)
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (toolCurrentLabel() == "hammer" && controller.A.isPressed()) {
        if (grid.spriteRow(selected_block) - tiles.locationXY(tiles.locationOfSprite(char), tiles.XY.row) < 3) {
            grid.move(selected_block, 0, 1)
        }
    }
})
function uiAddMessageToQueue (text: string) {
    ui_message_queue.push(text)
}
function setupPlayer () {
    char = sprites.create(assets.image`PlayerIdle0`, SpriteKind.Player)
    char.ay = 250
    char.z = 1
    char_button_direction = -1
    scene.cameraFollowSprite(char)
    tiles.placeOnTile(char, tiles.getTileLocation(50, groundLevelAtColumn(50) - 2))
    tiles.placeOnRandomTile(char, assets.tile`Grass`)
    grid.move(char, 0, -1)
    setupPlayerTools()
    setupPlayerInventory()
}
function inventoryGetAmountByLabel (item: string) {
    return items_inventory[itemsIdForLabel(item)]
}
function setupUIStatBars () {
    char_health_max = 25
    char_xp_max = 100
    char_health_current = char_health_max
    char_xp_current = 0
    char_health_bar = sprites.create(image.create(scene.screenWidth() - 22, 9), SpriteKind.UI)
    char_health_bar.setFlag(SpriteFlag.RelativeToCamera, true)
    char_health_bar.setPosition(char_health_bar.width / 2 + 2, char_health_bar.height / 2 + 2)
    uiUpdateStatBars()
}
function generateWorldNew () {
    tiles.setTilemap(tilemap`World`)
    scene.setBackgroundImage(assets.image`biomePlains`)
    scroller.scrollBackgroundWithCamera(scroller.CameraScrollMode.OnlyHorizontal, scroller.BackgroundLayer.Layer0)
    scroller.setCameraScrollingMultipliers(0.25, 0, scroller.BackgroundLayer.Layer0)
    world_rows = tiles.tilemapRows() - 0
    world_cols = tiles.tilemapColumns() - 0
    generateWorldBiomeLocations()
    world_ground_height = []
    for (let b of world_biome_locations) {
        generateWorldBiome(b)
    }
}
function setupPlayerTools () {
    tools_all = [
    "pickaxe",
    "hammer",
    "hand",
    "axe"
    ]
    tools_all_icons = [
    assets.image`TOOLpicaxePLATE`,
    assets.image`TOOLhammer`,
    assets.image`TOOLhand`,
    assets.image`TOOLaxePLATE`
    ]
    tools_all_images = [
    assets.image`toolPickaxe0`,
    assets.image`toolHammer`,
    assets.image`Empty`,
    assets.image`toolAxe0`
    ]
    tools_inventory = [
    2,
    1,
    0,
    3
    ]
    tool_selected = 0
    tool_selected_icon = sprites.create(toolCurrentIcon(), SpriteKind.Icon)
    tool_selected_icon.setFlag(SpriteFlag.RelativeToCamera, true)
    tool_selected_icon.setPosition(scene.screenWidth() - 10, 10)
}
function uiUpdateStatBars () {
    char_health_bar.image.fillRect(0, 0, char_health_bar.width, char_health_bar.height, 15)
    char_health_bar.image.fillRect(1, 1, char_health_bar.width - 2, char_health_bar.height / 2 - 1, 12)
    char_health_bar.image.fillRect(1, 1, (char_health_bar.width - 2) * (char_health_current / char_health_max), char_health_bar.height / 2 - 1, 2)
    char_health_bar.image.fillRect(1, char_health_bar.height / 2 + 1, char_health_bar.width - 2, char_health_bar.height / 2 - 1, 6)
    char_health_bar.image.fillRect(1, char_health_bar.height / 2 + 1, (char_health_bar.width - 2) * (char_xp_current / char_xp_max), char_health_bar.height / 2 - 1, 7)
}
function toolCurrentIcon () {
    return tools_all_icons[tools_inventory[tool_selected]]
}
function itemsIdForLabel (item: string) {
    return items_all.indexOf(item)
}
function generateBiomeGroundHeight (biome: string, col_start: number, col_end: number) {
    if (col_start > 0) {
        ground_prev = world_ground_height[world_ground_height.length - 1]
    } else {
        ground_prev = 15
    }
    ground_min = 8
    ground_max = 25
    for (let col = 0; col <= world_cols - 1; col++) {
        if (Math.percentChance(15)) {
            ground_current = Math.constrain(ground_prev - 1, ground_min, ground_max)
        } else if (Math.percentChance(15)) {
            ground_current = Math.constrain(ground_prev + 1, ground_min, ground_max)
        } else if (Math.percentChance(5)) {
            ground_current = Math.constrain(ground_prev - randint(2, 5), ground_min, ground_max)
        } else if (Math.percentChance(5)) {
            ground_current = Math.constrain(ground_prev + randint(2, 5), ground_min, ground_max)
        } else {
            ground_current = ground_prev
        }
        ground_prev = ground_current
        world_ground_height.push(ground_current)
    }
}
function spawnEnemy (_type: string) {
    if (_type == "mushroom") {
        sprites.allOfKind(SpriteKind.Enemy).push(enemy_sprite)
        enemy_sprite = sprites.create(assets.image`animalMushroom0`, SpriteKind.Enemy)
        sprites.setDataNumber(enemy_sprite, "gravity", 250)
        sprites.setDataNumber(enemy_sprite, "jump", randint(-100, -125))
        sprites.setDataNumber(enemy_sprite, "detection", 60)
        sprites.setDataBoolean(enemy_sprite, "detected", false)
        if (Math.percentChance(50)) {
            sprites.setDataNumber(enemy_sprite, "direction", 1)
        } else {
            sprites.setDataNumber(enemy_sprite, "direction", -1)
        }
        sprites.setDataNumber(enemy_sprite, "speed_normal", 10)
        sprites.setDataNumber(enemy_sprite, "speed_detected", 20)
        enemy_sprite.vx = sprites.readDataNumber(enemy_sprite, "speed_normal") * sprites.readDataNumber(enemy_sprite, "direction")
        if (Math.percentChance(50)) {
            enemy_sprite.x = char.x + (scene.screenWidth() + randint(-10, 20))
        } else {
            enemy_sprite.x = char.x - (scene.screenWidth() - randint(-10, 20))
        }
        enemy_sprite.y = 0
        enemy_sprite.ay = sprites.readDataNumber(enemy_sprite, "gravity")
        animation.runImageAnimation(
        enemy_sprite,
        assets.animation`AnimalMushroomWalking`,
        200,
        true
        )
    }
}
function toolCurrentImage () {
    return tools_all_images[tools_inventory[tool_selected]]
}
function getRandomWorldBiome () {
    if (Math.percentChance(25)) {
        return "snow"
    } else if (Math.percentChance(30)) {
        return "desert"
    } else {
        return "plains"
    }
}
function inventoryAddItemByTileImage (image2: Image) {
    inventoryAddAmountByLabel(inventoryGetItemLabelByTileImage(image2), 5)
    uiShowMessage("Added " + "5 " + inventoryGetItemLabelByTileImage(image2) + " (Total: " + inventoryGetAmountByLabel(inventoryGetItemLabelByTileImage(image2)) + ")")
}
function tooltest () {
    char_tool_sprite = sprites.create(toolCurrentImage().clone(), SpriteKind.Tool)
    sprites.setDataNumber(char_tool_sprite, "direction", 1)
    char_tool_sprite.setFlag(SpriteFlag.GhostThroughTiles, true)
    char_tool_sprite.setFlag(SpriteFlag.GhostThroughWalls, true)
    char_tool_sprite.z = 3
}
function setupPlayerInventory () {
    items_all = [
    "wood",
    "brick",
    "stone",
    "dirt"
    ]
    items_tile_images = [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    assets.tile`brick_block`,
    assets.tile`stone`,
    assets.tile`Dirt`
    ]
    items_tile_images_alt = [
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `,
    assets.tile`Grass`
    ]
    items_inventory = []
    for (let value2 of items_all) {
        items_inventory.push(0)
    }
}
function generateWorldBiome (biome_location: any[]) {
    temp_biome = biome_location[0]
    temp_biome_x = biome_location[1]
    temp_biome_y = biome_location[2]
    temp_biome_width = biome_location[3]
    temp_biome_height = biome_location[4]
    generateBiomeGroundHeight(temp_biome, temp_biome_y, temp_biome_y + temp_biome_width)
    if (temp_biome == 0) {
        generateWorldBiomePlains(biome_location)
    } else if (temp_biome == 1) {
        generateWorldBiomeSnow(biome_location)
    } else if (temp_biome == 2) {
        generateWorldBiomeDesert(biome_location)
    }
}
let enemy_sprite: Sprite = null
let tools_all_images: Image[] = []
let tools_all_icons: Image[] = []
let char_health_bar: Sprite = null
let char_health_current = 0
let char_xp_max = 0
let char_health_max = 0
let buildable_blocks: Image[] = []
let tools_all: string[] = []
let tree_height = 0
let temp_recipe_amount = 0
let temp_recipe_item = ""
let buildables_recipe_items: number[][][] = []
let temp_recipe: number[][] = []
let items_inventory: number[] = []
let ui_message: TextSprite = null
let entities_max = 0
let ui_message_queue: string[] = []
let char_speed_jump = 0
let char_speed_decel_rate = 0
let char_speed_rate = 0
let char_speed_max = 0
let tick_speed = 0
let buildables_all: string[] = []
let buildables_tile_images: Image[] = []
let char_button_direction = 0
let ground_current = 0
let ground_max = 0
let ground_min = 0
let ground_prev = 0
let char_tool_sprite: Sprite = null
let tool_selected_icon: Sprite = null
let tools_inventory: number[] = []
let tool_selected = 0
let world_rows = 0
let world_biome_width = 0
let world_cols = 0
let world_col_index = 0
let world_biome_cols_max = 0
let world_biome_cols_min = 0
let world_biome_cols_lookup: any[] = []
let world_biome_locations: number[][] = []
let world_biome_types: string[] = []
let items_tile_images_alt: Image[] = []
let items_tile_images: Image[] = []
let char_xp_current = 0
let items_all: string[] = []
let char: Sprite = null
let temp_y = 0
let temp_x = 0
let temp_biome_height: any = null
let temp_biome_width: any = null
let temp_biome_y: any = null
let temp_biome_x: any = null
let temp_biome: any = null
let world_ground_height: number[] = []
let debug_mode = false
let selected_block: Sprite = null
debug_mode = false
setupVariables()
setupUIMessages()
setupUIStatBars()
generateWorldNew()
setupPlayer()
setupBuildables()
setupBuildableTiles()
tooltest()
game.onUpdate(function () {
    if (controller.down.isPressed()) {
        char_button_direction = 3
    } else if (controller.up.isPressed()) {
        char_button_direction = 1
    } else if (controller.right.isPressed()) {
        char_button_direction = 2
    } else if (controller.left.isPressed()) {
        char_button_direction = 0
    } else {
        char_button_direction = -1
    }
})
game.onUpdate(function () {
    if (toolCurrentLabel() == "hammer" && controller.A.isPressed()) {
        char.vx = 0
        if (sprites.readDataNumber(selected_block, "blink") >= sprites.readDataNumber(selected_block, "blink_at")) {
            selected_block.setImage(assets.image`Target`)
        } else {
            selected_block.setImage(sprites.readDataImage(selected_block, "img"))
        }
        sprites.changeDataNumberBy(selected_block, "blink", 1)
        if (sprites.readDataNumber(selected_block, "blink") >= sprites.readDataNumber(selected_block, "blink_max")) {
            sprites.setDataNumber(selected_block, "blink", 0)
        }
    } else {
        if (char.isHittingTile(CollisionDirection.Bottom)) {
            if (controller.up.isPressed()) {
                char.vy = char_speed_jump
            }
        }
        if (controller.left.isPressed()) {
            if (!(char.isHittingTile(CollisionDirection.Left))) {
                char.vx = Math.constrain(char.vx - char_speed_rate, 0 - char_speed_max, char_speed_max)
            }
        } else if (controller.right.isPressed()) {
            if (!(char.isHittingTile(CollisionDirection.Right))) {
                char.vx = Math.constrain(char.vx + char_speed_rate, 0 - char_speed_max, char_speed_max)
            }
        } else {
            if (Math.abs(char.vx) > 1) {
                char.vx = char.vx * char_speed_decel_rate
            } else {
                char.vx = 0
            }
        }
    }
})
game.onUpdate(function () {
    if (char_button_direction == 0) {
        sprites.setDataNumber(char_tool_sprite, "direction", -1)
        if (char_tool_sprite.image.equals(toolCurrentImage().clone())) {
            char_tool_sprite.setImage(toolCurrentImage().clone())
            char_tool_sprite.image.flipX()
        }
    } else if (char_button_direction == 2) {
        sprites.setDataNumber(char_tool_sprite, "direction", 1)
        if (!(char_tool_sprite.image.equals(toolCurrentImage().clone()))) {
            char_tool_sprite.setImage(toolCurrentImage().clone())
        }
    }
    if (sprites.readDataNumber(char_tool_sprite, "direction") == -1) {
        char_tool_sprite.setPosition(char.x - 5, char.y - 1)
    } else {
        char_tool_sprite.setPosition(char.x + 5, char.y - 1)
    }
})
game.onUpdateInterval(tick_speed * 2, function () {
    if (sprites.allOfKind(SpriteKind.Enemy).length < entities_max) {
        spawnEnemy("mushroom")
    }
})
// Enemy AI Logic
game.onUpdateInterval(tick_speed / 5, function () {
    for (let e of sprites.allOfKind(SpriteKind.Enemy)) {
        if (Math.percentChance(20)) {
            if (e.isHittingTile(CollisionDirection.Bottom)) {
                e.vy = sprites.readDataNumber(e, "jump")
            }
        }
        if (Math.abs(char.x - e.x) <= sprites.readDataNumber(e, "detection") && Math.abs(char.y - e.y) <= sprites.readDataNumber(e, "detection")) {
            sprites.setDataBoolean(e, "detected", true)
            if (char.x <= e.x) {
                sprites.setDataNumber(e, "direction", -1)
            } else {
                sprites.setDataNumber(e, "direction", 1)
            }
            e.vx = sprites.readDataNumber(e, "speed_detected") * sprites.readDataNumber(e, "direction")
        } else {
            sprites.setDataBoolean(e, "detected", false)
            e.vx = sprites.readDataNumber(e, "speed_normal") * sprites.readDataNumber(e, "direction")
        }
    }
})
forever(function () {
    if (Math.percentChance(75)) {
        music.playMelody("C B A G A G F G ", 150)
        music.playMelody("G F G A B A D G ", 150)
        for (let index = 0; index < 2; index++) {
            music.playMelody("E D G F B A C5 B ", 150)
            music.playMelody("B C5 G A E F D E ", 150)
        }
        music.playMelody("C D E F G A B C ", 150)
        music.playMelody("C5 B A G F E D C5 ", 150)
    } else {
        for (let index = 0; index < 2; index++) {
            music.playMelody("C5 E D B D F B - ", 150)
        }
        for (let index = 0; index < 4; index++) {
            music.playMelody("C5 B A G F E D C ", 150)
            music.playMelody("C D E F G A B C5 ", 150)
        }
        for (let index = 0; index < 2; index++) {
            music.playMelody("C C C C5 C5 C C C ", 150)
        }
        music.playMelody("C C C C5 C5 C F C ", 150)
        for (let index = 0; index < 4; index++) {
            music.playMelody("E B C5 A B G A F ", 150)
        }
        music.playMelody("A F E F D G E F ", 150)
    }
})
game.onUpdateInterval(500, function () {
    console.log(getPlayerBiome())
    console.log(char.tilemapLocation().column)
    if (getPlayerBiome() == "snow") {
        scene.setBackgroundImage(assets.image`biomeSnow`)
    } else if (getPlayerBiome() == "desert") {
        scene.setBackgroundImage(assets.image`biomeSand`)
    } else {
        scene.setBackgroundImage(assets.image`biomePlains`)
    }
})
// For handling UI messages.
game.onUpdateInterval(200, function () {
    if (ui_message_queue.length > 0) {
        uiShowMessage(ui_message_queue.shift())
    } else {
        if (ui_message.y > scene.screenHeight() + 200) {
            ui_message.ay = 0
            ui_message.setVelocity(0, 0)
        }
    }
})
