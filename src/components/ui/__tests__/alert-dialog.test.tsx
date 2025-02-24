import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../alert-dialog';

describe('AlertDialog Component', () => {
  it('renders the AlertDialog with trigger and content', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    // Check if the trigger is rendered
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();

    // Check if the dialog content is initially hidden
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('opens and closes the AlertDialog when the trigger is clicked', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    // Click the trigger to open the dialog
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);

    // Check if the dialog content is visible
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();

    // Click the cancel button to close the dialog
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Check if the dialog content is hidden again
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument();
  });

  it('calls the action and cancel handlers when buttons are clicked', () => {
    const handleAction = vi.fn();
    const handleCancel = vi.fn();

    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Title</AlertDialogTitle>
            <AlertDialogDescription>Test Description</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    // Open the dialog
    const trigger = screen.getByText('Open Dialog');
    fireEvent.click(trigger);

    // Click the action button
    const actionButton = screen.getByText('Continue');
    fireEvent.click(actionButton);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

