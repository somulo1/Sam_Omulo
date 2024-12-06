import { supabase } from '../lib/supabaseClient';
import { handleSupabaseError } from './supabase';

// Track page views
export const trackPageView = async (path: string) => {
  try {
    const { error } = await supabase
      .from('page_views')
      .insert({ 
        path, 
        timestamp: new Date().toISOString() 
      });

    if (error) throw error;
  } catch (error) {
    console.error('Page view tracking error:', handleSupabaseError(error));
  }
};

// Track user interactions
export const trackEvent = async (
  event_name: string, 
  event_properties?: Record<string, any>
) => {
  try {
    const { error } = await supabase
      .from('user_events')
      .insert({ 
        event_name, 
        event_properties: event_properties || {}, 
        timestamp: new Date().toISOString() 
      });

    if (error) throw error;
  } catch (error) {
    console.error('Event tracking error:', handleSupabaseError(error));
  }
};

// Get basic analytics data
export const getAnalytics = async () => {
  try {
    const pageViews = await supabase
      .from('page_views')
      .select('*');

    const userEvents = await supabase
      .from('user_events')
      .select('*');

    return {
      pageViews: pageViews.data || [],
      userEvents: userEvents.data || []
    };
  } catch (error) {
    console.error('Analytics fetch error:', handleSupabaseError(error));
    return { pageViews: [], userEvents: [] };
  }
};