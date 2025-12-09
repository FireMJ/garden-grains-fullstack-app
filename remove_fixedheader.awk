/^function FixedHeader\(\) \{/ {
    skip = 1
    next
}
skip && /^\}[[:space:]]*$/ {
    skip = 0
    next
}
!skip { print }
