package main

import (
	"fmt"
	"os"

	"github.com/ranjib/ranjib.github.io/internal/editorialradar"
)

func main() {
	root := "."
	if len(os.Args) > 1 {
		root = os.Args[1]
	}

	failures := editorialradar.Validate(root)
	if len(failures) > 0 {
		fmt.Fprintln(os.Stderr, "Editorial radar validation failed:")
		for _, failure := range failures {
			fmt.Fprintf(os.Stderr, "- %s\n", failure)
		}
		os.Exit(1)
	}

	fmt.Println("Editorial radar validation passed.")
}
