class AddAttributesToPost < ActiveRecord::Migration
  def change

  	add_column :posts, :in_reply_to_post_id, :integer
  	add_column :posts, :in_reply_to_user_id, :integer
  	add_column :posts, :in_reply_to_user_name, :string
  	add_column :posts, :source_ip, :string
  	
  end
end
