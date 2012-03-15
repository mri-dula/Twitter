class Post < ActiveRecord::Base
	validates_presence_of :message
	validates_size_of :message , :maximum => 140
	belongs_to :user
	has_many :tags

  scope :by_users, lambda {|user_ids| where(:user_id => user_ids) }
  scope :latest_first, order('created_at DESC')

end
