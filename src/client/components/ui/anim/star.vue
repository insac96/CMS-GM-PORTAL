<template>
  <div id="StarAnim">
    <div id='stars dark:hidden'></div>
    <div id='stars2'></div>
    <div id='stars3 dark:hidden'></div>
    <div id='stars4 dark:hidden'></div>
  </div>
</template>

<style lang="sass">
@function multiple-box-shadow ($n) 
  $value: '#{random(2000)}px #{random(2000)}px rgb(var(--color-primary-DEFAULT))'
  @for $i from 2 through $n
    $value: '#{$value} , #{random(2000)}px #{random(2000)}px rgb(var(--color-primary-DEFAULT))'

  @return unquote($value)

$shadows-small:  multiple-box-shadow(700)
$shadows-medium: multiple-box-shadow(200)
$shadows-big:    multiple-box-shadow(100)
$shadows-big2:    multiple-box-shadow(100)

#StarAnim
  position: fixed
  top: 0
  left: 0
  z-index: 0
#stars
  position: relative
  width: 1px
  height: 1px
  background: transparent
  box-shadow: $shadows-small
  animation: animStar 50s linear infinite
  border-radius: 50%
    
  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 1px
    height: 1px
    background: transparent
    box-shadow: $shadows-small
    border-radius: 50%
    
#stars2
  position: relative
  width: 2px
  height: 2px
  background: transparent
  box-shadow: $shadows-medium
  animation: animStar 100s linear infinite
  border-radius: 50%
    
  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 2px
    height: 2px
    background: transparent
    box-shadow: $shadows-medium
    border-radius: 50%
    
#stars3
  position: relative
  width: 3px
  height: 3px
  background: transparent
  box-shadow: $shadows-big
  animation: animStar 150s linear infinite
  border-radius: 50%
    
  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 3px
    height: 3px
    background: transparent
    box-shadow: $shadows-big
    border-radius: 50%

#stars4
  position: relative
  width: 4px
  height: 4px
  background: transparent
  box-shadow: $shadows-big2
  animation: animStar 150s linear infinite
  border-radius: 50%
    
  &:after
    content: " "
    position: absolute
    top: 2000px
    width: 4px
    height: 4px
    background: transparent
    box-shadow: $shadows-big2
    border-radius: 50%

@keyframes animStar
  from  
    transform: translateY(0px)
  to    
    transform: translateY(-2000px)
</style>