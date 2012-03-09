class Post < ActiveRecord::Base
	validates_presence_of :message
	validates_size_of :message , :maximum => 140
	belongs_to :user
	has_many :tags
end
